import axios from "axios";

export const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

// Accept an Axios-compatible client so the test can use a local fixture.
export async function fetchPosts(client = axios) {
  const response = await client.get(POSTS_URL, { timeout: 5000 });
  if (!Array.isArray(response.data)) throw new Error("The posts service returned invalid data");
  return response.data;
}
