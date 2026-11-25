// Users are kept in memory for this exercise, so they are gone when the server restarts.
const users = [];
let nextId = 1;

export function findByUsername(username) {
  return users.find(user => user.username === username.trim().toLowerCase());
}

export function findByEmail(email) {
  return users.find(user => user.email === email.trim().toLowerCase());
}

export function findById(id) {
  return users.find(user => user.id === id);
}

export function createUser({ username, email, passwordHash }) {
  const user = {
    id: nextId++,
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function listUsers() {
  return users;
}

// Never send the hash to the client.
export function toPublic(user) {
  return { id: user.id, username: user.username, email: user.email, createdAt: user.createdAt };
}
