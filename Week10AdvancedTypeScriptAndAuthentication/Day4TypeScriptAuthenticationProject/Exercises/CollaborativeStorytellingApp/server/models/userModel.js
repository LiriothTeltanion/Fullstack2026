import { db, pool, usePostgres, tables } from "./db.js";

function fromRow(row) {
  return row && { id: row.id, username: row.username, passwordHash: row.password_hash };
}

export async function findUserByUsername(username) {
  const normalized = username.trim().toLowerCase();
  if (!usePostgres) return db.users.find(user => user.username === normalized);
  const result = await pool.query(`SELECT * FROM ${tables.users} WHERE username = $1`, [
    normalized,
  ]);
  return fromRow(result.rows[0]);
}

export async function findUserById(id) {
  if (!Number.isSafeInteger(id) || id < 1) return undefined;
  if (!usePostgres) return db.users.find(user => user.id === id);
  const result = await pool.query(`SELECT * FROM ${tables.users} WHERE id = $1`, [id]);
  return fromRow(result.rows[0]);
}

export async function createUser(username, passwordHash) {
  const normalized = username.trim().toLowerCase();
  if (!usePostgres) {
    if (db.users.some(user => user.username === normalized)) {
      const error = new Error("That username is taken");
      error.status = 409;
      throw error;
    }
    const user = { id: db.nextUserId++, username: normalized, passwordHash };
    db.users.push(user);
    return user;
  }
  const result = await pool.query(
    `INSERT INTO ${tables.users} (username, password_hash) VALUES ($1, $2) RETURNING *`,
    [normalized, passwordHash]
  );
  return fromRow(result.rows[0]);
}

export function toPublicUser(user) {
  return { id: user.id, username: user.username };
}
