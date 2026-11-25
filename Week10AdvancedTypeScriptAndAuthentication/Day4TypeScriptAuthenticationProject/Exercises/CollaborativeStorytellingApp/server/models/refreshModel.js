import { randomUUID } from "node:crypto";
import { db, pool, usePostgres, tables } from "./db.js";

const lifetime = 7 * 24 * 60 * 60 * 1000;
function newSession(userId) {
  return { id: randomUUID(), userId, expiresAt: new Date(Date.now() + lifetime).toISOString() };
}

export async function createRefreshSession(userId) {
  const item = newSession(userId);
  if (!usePostgres) db.refreshSessions.set(item.id, item);
  else
    await pool.query(
      `INSERT INTO ${tables.refresh_sessions} (id, user_id, expires_at) VALUES ($1, $2, $3)`,
      [item.id, userId, item.expiresAt]
    );
  return item;
}

/** Consume and replace one refresh session atomically so a token cannot be replayed. */
export async function rotateRefreshSession(id) {
  if (!usePostgres) {
    const current = db.refreshSessions.get(id);
    if (!current || new Date(current.expiresAt).getTime() <= Date.now()) return undefined;
    const replacement = newSession(current.userId);
    db.refreshSessions.delete(id);
    db.refreshSessions.set(replacement.id, replacement);
    return replacement;
  }
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const current = await client.query(
      `SELECT * FROM ${tables.refresh_sessions} WHERE id = $1 AND expires_at > CURRENT_TIMESTAMP FOR UPDATE`,
      [id]
    );
    if (!current.rows.length) {
      await client.query("ROLLBACK");
      return undefined;
    }
    const replacement = newSession(current.rows[0].user_id);
    await client.query(`DELETE FROM ${tables.refresh_sessions} WHERE id = $1`, [id]);
    await client.query(
      `INSERT INTO ${tables.refresh_sessions} (id, user_id, expires_at) VALUES ($1, $2, $3)`,
      [replacement.id, replacement.userId, replacement.expiresAt]
    );
    await client.query("COMMIT");
    return replacement;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteRefreshSession(id) {
  if (!usePostgres) db.refreshSessions.delete(id);
  else await pool.query(`DELETE FROM ${tables.refresh_sessions} WHERE id = $1`, [id]);
}
