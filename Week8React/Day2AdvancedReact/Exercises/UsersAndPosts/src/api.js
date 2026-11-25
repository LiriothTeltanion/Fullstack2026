const BASE_URL = "https://jsonplaceholder.typicode.com";

async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

export const getUsers = () => getJson("/users");
export const getUser = id => getJson(`/users/${id}`);
export const getPostsByUser = id => getJson(`/posts?userId=${id}`);
