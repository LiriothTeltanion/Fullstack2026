/** @typedef {import("../../shared/types").StoryComment} PublicComment */
import { db, pool, tables, usePostgres } from "./db.js";
import {
  commentSettingsCapabilities,
  lockDiscussion,
  commentsClosed,
  commentsUnavailable,
} from "./commentSettingsModel.js";

/** Return only the public author identity, never an account's password or email. */
function toPublicComment(comment) {
  return {
    id: comment.id,
    storyId: comment.storyId,
    author: { id: comment.authorId, username: comment.authorUsername },
    body: comment.body,
    createdAt: comment.createdAt,
  };
}

function fromRow(row) {
  return (
    row && {
      id: row.id,
      storyId: row.story_id,
      authorId: row.author_id,
      authorUsername: row.author_username,
      body: row.body,
      createdAt: new Date(row.created_at).toISOString(),
    }
  );
}

/** Comments use chronological order; IDs make equal timestamps deterministic. */
export async function listComments(storyId) {
  if (!usePostgres) {
    const comments = db.comments
      .filter(comment => comment.storyId === storyId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id - b.id);
    return comments.map(comment =>
      toPublicComment({
        ...comment,
        authorUsername: db.users.find(user => user.id === comment.authorId)?.username ?? "unknown",
      })
    );
  }
  const result = await pool.query(
    `SELECT c.id, c.story_id, c.author_id, c.body, c.created_at,
            u.username AS author_username
     FROM ${tables.story_comments} c
     JOIN ${tables.users} u ON u.id = c.author_id
     WHERE c.story_id = $1 ORDER BY c.created_at, c.id`,
    [storyId]
  );
  return result.rows.map(row => toPublicComment(fromRow(row)));
}

/** @returns {Promise<PublicComment | undefined>} */
export async function createComment({ storyId, authorId, body }) {
  if (!usePostgres) {
    const story = db.stories.find(item => item.id === storyId);
    if (!story) return undefined;
    if (story.commentsOpen === false) throw commentsClosed();
    const comment = {
      id: db.nextCommentId++,
      storyId,
      authorId,
      body,
      createdAt: new Date().toISOString(),
    };
    db.comments.push(comment);
    return toPublicComment({
      ...comment,
      authorUsername: db.users.find(user => user.id === authorId)?.username ?? "unknown",
    });
  }
  const capability = await commentSettingsCapabilities();
  if (capability.supported && !capability.readable) throw commentsUnavailable();
  let client;
  try {
    if (capability.supported) {
      client = await pool.connect();
      await client.query("BEGIN");
      await lockDiscussion(client, storyId);
      const state = await client.query(
        `SELECT comments_open FROM ${tables.stories} WHERE id = $1`,
        [storyId]
      );
      if (!state.rows.length) {
        await client.query("COMMIT");
        return undefined;
      }
      if (state.rows[0].comments_open === false) throw commentsClosed();
    }
    // The existence check is part of the write, not a separate read/write race.
    const result = await (client ?? pool).query(
      `WITH inserted AS (
         INSERT INTO ${tables.story_comments} (story_id, author_id, body)
         SELECT id, $2, $3 FROM ${tables.stories} WHERE id = $1
         RETURNING id, story_id, author_id, body, created_at
       )
       SELECT c.id, c.story_id, c.author_id, c.body, c.created_at,
              u.username AS author_username
       FROM inserted c JOIN ${tables.users} u ON u.id = c.author_id`,
      [storyId, authorId, body]
    );
    if (client) await client.query("COMMIT");
    return result.rows[0] && toPublicComment(fromRow(result.rows[0]));
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    if (capability.supported && (error.code === "42501" || error.code === "42703"))
      throw commentsUnavailable();
    // A story can also disappear while PostgreSQL is checking its foreign key.
    if (error.code === "23503" && error.constraint === "story_comments_story_id_fkey") {
      return undefined;
    }
    throw error;
  } finally {
    client?.release();
  }
}

/** Look up a comment within its story; a comment ID never selects another discussion. */
export async function findComment(storyId, commentId) {
  if (!Number.isSafeInteger(commentId) || commentId < 1) return undefined;
  if (!usePostgres) {
    const comment = db.comments.find(item => item.storyId === storyId && item.id === commentId);
    return (
      comment &&
      toPublicComment({
        ...comment,
        authorUsername: db.users.find(user => user.id === comment.authorId)?.username ?? "unknown",
      })
    );
  }
  const result = await pool.query(
    `SELECT c.id, c.story_id, c.author_id, c.body, c.created_at,
            u.username AS author_username
     FROM ${tables.story_comments} c JOIN ${tables.users} u ON u.id = c.author_id
     WHERE c.story_id = $1 AND c.id = $2`,
    [storyId, commentId]
  );
  return result.rows[0] && toPublicComment(fromRow(result.rows[0]));
}

/** Recheck identity in the write itself, including after a concurrent deletion. */
export async function updateComment({ storyId, commentId, userId, body }) {
  if (!usePostgres) {
    const comment = db.comments.find(
      item => item.storyId === storyId && item.id === commentId && item.authorId === userId
    );
    if (!comment) return undefined;
    comment.body = body;
    return findComment(storyId, commentId);
  }
  const result = await pool.query(
    `WITH changed AS (
       UPDATE ${tables.story_comments} SET body = $4
       WHERE story_id = $1 AND id = $2 AND author_id = $3
       RETURNING id, story_id, author_id, body, created_at
     )
     SELECT c.id, c.story_id, c.author_id, c.body, c.created_at,
            u.username AS author_username
     FROM changed c JOIN ${tables.users} u ON u.id = c.author_id`,
    [storyId, commentId, userId, body]
  );
  return result.rows[0] && toPublicComment(fromRow(result.rows[0]));
}

/** Story authors may moderate by deleting; collaborator status grants no comment rights. */
export async function deleteComment({ storyId, commentId, userId }) {
  if (!usePostgres) {
    const index = db.comments.findIndex(
      item =>
        item.storyId === storyId &&
        item.id === commentId &&
        (item.authorId === userId ||
          db.stories.some(story => story.id === storyId && story.authorId === userId))
    );
    if (index < 0) return false;
    db.comments.splice(index, 1);
    return true;
  }
  const result = await pool.query(
    `DELETE FROM ${tables.story_comments} c
     WHERE c.story_id = $1 AND c.id = $2
       AND (c.author_id = $3 OR EXISTS (
         SELECT 1 FROM ${tables.stories} s WHERE s.id = c.story_id AND s.author_id = $3
       )) RETURNING c.id`,
    [storyId, commentId, userId]
  );
  return result.rows.length > 0;
}

/** One small uncached query uses the connection's effective role, not an env flag.
 * Rechecking lets a database-owner grant take effect without another deployment.
 */
export async function commentCapabilities() {
  if (!usePostgres) return { edit: true, delete: true };
  try {
    const result = await pool.query(
      `SELECT has_column_privilege(current_user, $1, 'body', 'UPDATE') AS edit,
              has_table_privilege(current_user, $1, 'DELETE') AS delete`,
      [tables.story_comments]
    );
    return { edit: result.rows[0]?.edit === true, delete: result.rows[0]?.delete === true };
  } catch {
    // Capability discovery must fail closed, without leaking database details.
    return { edit: false, delete: false };
  }
}
