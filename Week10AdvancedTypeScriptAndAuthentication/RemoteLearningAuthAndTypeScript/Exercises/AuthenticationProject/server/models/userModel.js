// In-memory users: they are lost when the server restarts.
const users = [];
let nextId = 1;

export const findByEmail = email => users.find(user => user.email === email.trim().toLowerCase());
export const findById = id => users.find(user => user.id === id);

export function createUser({ name, email, passwordHash }) {
  const normalizedEmail = email.trim().toLowerCase();
  // Check and insert synchronously: duplicates return no user and consume no ID.
  if (findByEmail(normalizedEmail)) return undefined;
  const user = {
    id: nextId++,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    bio: "",
    joinedAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}

export function updateProfile(user, { name, bio }) {
  if (typeof name === "string" && name.trim()) user.name = name.trim();
  if (typeof bio === "string") user.bio = bio.trim().slice(0, 280);
  return user;
}

export function toPublic(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    joinedAt: user.joinedAt,
  };
}
