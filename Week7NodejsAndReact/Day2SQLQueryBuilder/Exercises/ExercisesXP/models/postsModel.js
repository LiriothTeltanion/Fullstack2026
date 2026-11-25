// Every function returns a promise from Knex.
import db from "../db/db.js";

export function getAllPosts() {
  return db("posts").select("id", "title", "content", "created_at").orderBy("id");
}

export function getPostById(id) {
  return db("posts").where({ id }).first();
}

export async function createPost({ title, content }) {
  const [post] = await db("posts").insert({ title, content }).returning("*");
  return post;
}

export async function updatePost(id, { title, content }) {
  const [post] = await db("posts").where({ id }).update({ title, content }).returning("*");
  return post; // undefined when no row matched
}

export function deletePost(id) {
  return db("posts").where({ id }).del(); // number of deleted rows
}
