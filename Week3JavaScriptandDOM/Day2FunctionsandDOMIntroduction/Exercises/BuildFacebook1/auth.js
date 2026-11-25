// Created 2026-11-25. Artificial credentials for a browser exercise.
export const database = [{ username: "mira", password: "mira-demo" }];
export const newsfeed = [
  { username: "mira", timeline: "I finished a small Python tool today." },
  { username: "noam", timeline: "The garden looks bright after the rain." },
  { username: "luca", timeline: "Trying a new chord progression this evening." },
];

export function signIn(username, password) {
  const valid = database[0].username === username && database[0].password === password;
  if (valid) {
    console.log(newsfeed);
    return newsfeed;
  }
  return null;
}
