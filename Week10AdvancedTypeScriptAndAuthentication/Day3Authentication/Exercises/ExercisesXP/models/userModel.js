import { database } from "./database.js";

export function findByUsername(username) {
  return database
    .prepare("SELECT * FROM users WHERE username=?")
    .get(username.trim().toLowerCase());
}
export function findByEmail(email) {
  return database.prepare("SELECT * FROM users WHERE email=?").get(email.trim().toLowerCase());
}
export function findById(id) {
  return database.prepare("SELECT * FROM users WHERE id=?").get(id);
}
export function createUser({
  username,
  email,
  passwordHash,
  confirmationDigest = null,
  confirmationExpiresAt = null,
}) {
  const result = database
    .prepare(
      "INSERT INTO users(username,email,passwordHash,createdAt,confirmationDigest,confirmationExpiresAt) VALUES(?,?,?,?,?,?)"
    )
    .run(
      username.trim().toLowerCase(),
      email.trim().toLowerCase(),
      passwordHash,
      new Date().toISOString(),
      confirmationDigest,
      confirmationExpiresAt
    );
  return findById(Number(result.lastInsertRowid));
}
export function confirmEmail(digest) {
  const result = database
    .prepare(
      "UPDATE users SET emailVerified=1,confirmationDigest=NULL,confirmationExpiresAt=NULL WHERE confirmationDigest=? AND confirmationExpiresAt>? AND emailVerified=0"
    )
    .run(digest, Date.now());
  return result.changes === 1;
}
export function listUsers() {
  return database.prepare("SELECT * FROM users ORDER BY id").all();
}
export function toPublic(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    emailVerified: Boolean(user.emailVerified),
  };
}
