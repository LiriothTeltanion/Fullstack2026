import { db, pool, usePostgres, tables } from "./db.js";

function fromRow(row) {
  return (
    row && {
      id: row.id,
      username: row.username,
      email: row.email,
      passwordHash: row.password_hash,
    }
  );
}

export function normalizeEmail(email) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

/** Accept conventional email addresses without permitting whitespace or empty domain labels. */
export function isValidEmail(email) {
  if (typeof email !== "string" || email.length > 254) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (
    !local ||
    local.length > 64 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..")
  )
    return false;
  const labels = domain.split(".");
  return (
    labels.length >= 2 &&
    labels.every(label => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label))
  );
}

function conflict(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

export async function findUserByUsername(username) {
  if (typeof username !== "string") return undefined;
  const normalized = username.trim().toLowerCase();
  if (!usePostgres) return db.users.find(user => user.username === normalized);
  const result = await pool.query(`SELECT * FROM ${tables.users} WHERE username = $1`, [
    normalized,
  ]);
  return fromRow(result.rows[0]);
}

export async function findUserByEmail(email) {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return undefined;
  if (!usePostgres) return db.users.find(user => normalizeEmail(user.email) === normalized);
  const result = await pool.query(`SELECT * FROM ${tables.users} WHERE lower(email) = $1`, [
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

export async function createUser(username, passwordHash, email) {
  const normalizedEmail = normalizeEmail(email);
  if (!isValidEmail(normalizedEmail)) {
    const error = new Error("A valid email address is required");
    error.status = 400;
    throw error;
  }
  const normalized = username.trim().toLowerCase();
  if (!usePostgres) {
    if (db.users.some(user => user.username === normalized)) {
      throw conflict("That username is taken");
    }
    if (db.users.some(user => normalizeEmail(user.email) === normalizedEmail)) {
      throw conflict("That email is already registered");
    }
    // No await between checking and insertion: concurrent requests cannot both claim an email.
    const user = {
      id: db.nextUserId++,
      username: normalized,
      email: normalizedEmail,
      passwordHash,
    };
    db.users.push(user);
    return user;
  }
  try {
    // PostgreSQL's users_email_unique index arbitrates races across processes/instances.
    const result = await pool.query(
      `INSERT INTO ${tables.users} (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
      [normalized, normalizedEmail, passwordHash]
    );
    return fromRow(result.rows[0]);
  } catch (error) {
    if (error.code !== "23505") throw error;
    // Never pass database detail (which can include a private email) into an API response.
    if (error.constraint === "users_email_unique") {
      throw conflict("That email is already registered");
    }
    if (error.constraint === "users_username_key") throw conflict("That username is taken");
    throw conflict("That username or email is already registered");
  }
}

export function toPublicUser(user) {
  // Contributor/story listings intentionally expose neither email nor authentication data.
  return { id: user.id, username: user.username };
}
