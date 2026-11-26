import axios from "axios";

export async function fetchPost(id, client = axios) {
  const number = Number(id);
  if (!Number.isSafeInteger(number) || number < 1)
    throw new Error("Choose a positive post number.");
  const { data } = await client.get(`https://jsonplaceholder.typicode.com/posts/${number}`, {
    timeout: 8000,
  });
  if (typeof data?.title !== "string" || typeof data?.body !== "string") {
    throw new Error("The post service returned an unreadable post.");
  }
  return data;
}
