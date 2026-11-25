import type { Role, User } from "./types.js";

// In-memory data for the exercise; it resets when the server restarts.
const users: User[] = [];
let nextId = 1;

export const userStore = {
  findByUsername: (username: string) =>
    users.find(user => user.username === username.trim().toLowerCase()),
  findById: (id: number) => users.find(user => user.id === id),
  all: () => users,
  create(username: string, passwordHash: string): User {
    // The very first account becomes the admin, so there is always one.
    const role: Role = users.length === 0 ? "admin" : "user";
    const user: User = {
      id: nextId++,
      username: username.trim().toLowerCase(),
      passwordHash,
      role,
    };
    users.push(user);
    return user;
  },
};

// Refresh tokens that are still valid, by their id (jti) -> user id.
// Rotating or logging out deletes the entry, so an old refresh token stops working.
export const refreshTokens = new Map<string, number>();

export const publicUser = (user: User) => ({
  id: user.id,
  username: user.username,
  role: user.role,
});
