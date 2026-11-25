import { db } from "./db.js";

export function findUserByUsername(username) {
  return db.users.find(user => user.username === username.trim().toLowerCase());
}

export function findUserById(id) {
  return db.users.find(user => user.id === id);
}

export function createUser(username, passwordHash) {
  const user = { id: db.nextUserId++, username: username.trim().toLowerCase(), passwordHash };
  db.users.push(user);
  return user;
}

export function toPublicUser(user) {
  return { id: user.id, username: user.username };
}
