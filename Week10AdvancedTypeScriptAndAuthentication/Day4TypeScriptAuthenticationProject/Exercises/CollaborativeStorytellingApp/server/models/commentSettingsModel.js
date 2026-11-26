import { db, pool, tables, usePostgres } from "./db.js";

export function commentsUnavailable() {
  return Object.assign(new Error("Comment settings are unavailable. Please try again later."), {
    status: 503,
  });
}

export function commentsClosed() {
  return Object.assign(new Error("New comments are closed for this story."), { status: 409 });
}

/** Inspect schema independently of grants: a hidden column must never mean open. */
export async function commentSettingsCapabilities() {
  if (!usePostgres) return { supported: true, readable: true, change: true };
  const { rows } = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM pg_attribute
       WHERE attrelid = $1::regclass AND attname = 'comments_open' AND NOT attisdropped) AS present`,
    [tables.stories]
  );
  if (!rows[0].present) return { supported: false, readable: false, change: false };
  const result = await pool.query(
    `SELECT has_column_privilege(current_user, $1, 'comments_open', 'SELECT') AS readable,
            has_column_privilege(current_user, $1, 'comments_open', 'UPDATE') AS change`,
    [tables.stories]
  );
  return {
    supported: true,
    readable: result.rows[0].readable === true,
    change: result.rows[0].change === true,
  };
}

/** The same transaction-scoped lock orders posting and closing across API processes.
 * It requires no additional table UPDATE grant merely to post a comment.
 */
export async function lockDiscussion(client, storyId) {
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1), $2)", [tables.stories, storyId]);
}

export async function readCommentSettings(storyId) {
  const capability = await commentSettingsCapabilities();
  if (!capability.supported) return { supported: false, commentsOpen: true, canChange: false };
  if (!capability.readable) throw commentsUnavailable();
  const story = usePostgres
    ? (await pool.query(`SELECT comments_open FROM ${tables.stories} WHERE id = $1`, [storyId]))
        .rows[0]
    : db.stories.find(item => item.id === storyId);
  if (!story) return undefined;
  return {
    supported: true,
    commentsOpen: (usePostgres ? story.comments_open : story.commentsOpen) !== false,
    canChange: capability.change,
  };
}

export async function changeCommentSettings(storyId, authorId, commentsOpen) {
  const capability = await commentSettingsCapabilities();
  if (!capability.supported || !capability.readable || !capability.change)
    throw commentsUnavailable();
  if (!usePostgres) {
    const story = db.stories.find(item => item.id === storyId && item.authorId === authorId);
    if (!story) return undefined;
    story.commentsOpen = commentsOpen;
  } else {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await lockDiscussion(client, storyId);
      const result = await client.query(
        `UPDATE ${tables.stories} SET comments_open = $3 WHERE id = $1 AND author_id = $2 RETURNING id`,
        [storyId, authorId, commentsOpen]
      );
      await client.query("COMMIT");
      if (!result.rows.length) return undefined;
    } catch (error) {
      await client.query("ROLLBACK");
      if (error.code === "42501" || error.code === "42703") throw commentsUnavailable();
      throw error;
    } finally {
      client.release();
    }
  }
  // Return the value this operation committed, not a later concurrent change.
  return { supported: true, commentsOpen, canChange: true };
}
