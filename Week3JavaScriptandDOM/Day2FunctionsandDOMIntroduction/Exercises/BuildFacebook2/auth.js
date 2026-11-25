// Created 2026-11-25. All accounts and feed entries are artificial.
export const database = [
  { username: "mira", password: "mira-demo" },
  { username: "noam", password: "noam-demo" },
  { username: "luca", password: "luca-demo" },
];
export const newsfeed = [
  { username: "mira", timeline: "I finished a small Python tool today." },
  { username: "noam", timeline: "The garden looks bright after the rain." },
  { username: "luca", timeline: "Trying a new chord progression this evening." },
];

export function isUserValid(username, password) {
  // Both credentials must match the same object. A failed first row is not final.
  for (const user of database) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
  return false;
}

export function signIn(username, password) {
  const valid = isUserValid(username, password);
  if (valid) {
    console.log(newsfeed);
    return newsfeed;
  }
  return null;
}
