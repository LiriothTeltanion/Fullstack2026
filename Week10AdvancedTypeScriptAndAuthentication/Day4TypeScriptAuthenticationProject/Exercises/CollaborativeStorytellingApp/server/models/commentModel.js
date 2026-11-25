/** @typedef {import("../../shared/types").StoryComment} PublicComment */
import { db, pool, tables, usePostgres } from "./db.js";

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
    if (!db.stories.some(story => story.id === storyId)) return undefined;
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
  try {
    // The existence check is part of the write, not a separate read/write race.
    const result = await pool.query(
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
    return result.rows[0] && toPublicComment(fromRow(result.rows[0]));
  } catch (error) {
    // A story can also disappear while PostgreSQL is checking its foreign key.
    if (error.code === "23503" && error.constraint === "story_comments_story_id_fkey") {
      return undefined;
    }
    throw error;
  }
}
