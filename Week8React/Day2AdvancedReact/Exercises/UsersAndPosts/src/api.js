const BASE_URL = "https://jsonplaceholder.typicode.com";

async function getJson(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, { signal: options.signal });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error("The service returned invalid JSON.");
  }
}

export function isValidUserId(id) {
  return /^\d+$/.test(String(id)) && Number.isSafeInteger(Number(id)) && Number(id) > 0;
}

function userPathId(id) {
  if (!isValidUserId(id)) throw new Error("Choose a valid user number.");
  return String(Number(id));
}

export async function getUsers(options) {
  const users = await getJson("/users", options);
  if (
    !Array.isArray(users) ||
    users.some(user => !user || !isValidUserId(user.id) || typeof user.name !== "string")
  ) {
    throw new Error("The service returned an invalid user list.");
  }
  return users;
}

export async function getUser(id, options) {
  const user = await getJson(`/users/${userPathId(id)}`, options);
  if (!user || !isValidUserId(user.id) || typeof user.name !== "string") {
    throw new Error("The service returned an invalid user.");
  }
  return user;
}

export async function getPostsByUser(id, options) {
  const posts = await getJson(`/posts?userId=${userPathId(id)}`, options);
  if (
    !Array.isArray(posts) ||
    posts.some(post => !post || typeof post.title !== "string" || typeof post.body !== "string")
  ) {
    throw new Error("The service returned an invalid post list.");
  }
  return posts;
}
