import db from "../config/db.js";

const PUBLIC_FIELDS = ["id", "email", "username", "first_name", "last_name"];

// Both inserts run in one transaction: if the second fails, the first is undone.
export function createUser(user, passwordHash) {
  return db.transaction(async trx => {
    const [newUser] = await trx("users").insert(user).returning(PUBLIC_FIELDS);
    await trx("hashpwd").insert({ username: newUser.username, password: passwordHash });
    return newUser;
  });
}

export function findByUsernameOrEmail(username, email) {
  return db("users").where({ username }).orWhere({ email }).first();
}

export function getPasswordHash(username) {
  return db("hashpwd").select("password").where({ username }).first();
}

export function getAllUsers() {
  return db("users").select(PUBLIC_FIELDS).orderBy("id");
}

export function getUserById(id) {
  return db("users").select(PUBLIC_FIELDS).where({ id }).first();
}

export async function updateUser(id, changes) {
  const [user] = await db("users").where({ id }).update(changes).returning(PUBLIC_FIELDS);
  return user;
}
