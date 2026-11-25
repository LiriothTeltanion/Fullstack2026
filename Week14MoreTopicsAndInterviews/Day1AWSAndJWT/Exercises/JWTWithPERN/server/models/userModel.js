import db from "../db/db.js";

// The columns that are safe to send to the browser (no password_hash)
const PUBLIC_COLUMNS = ["id", "username", "email", "created_at"];

export function findByEmail(email) {
  return db("users").where({ email }).first();
}

export function findById(id) {
  return db("users").select(PUBLIC_COLUMNS).where({ id }).first();
}

export async function createUser({ username, email, passwordHash }) {
  const [user] = await db("users")
    .insert({ username, email, password_hash: passwordHash })
    .returning(PUBLIC_COLUMNS);
  return user;
}
