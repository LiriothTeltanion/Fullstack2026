import db from "../db/knex.js";

export function getLatestMessages(limit = 50) {
  return db("messages")
    .select("id", "name", "text", "created_at")
    .orderBy("created_at", "desc")
    .limit(limit);
}

export async function addMessage({ name, text }) {
  const [message] = await db("messages")
    .insert({ name, text })
    .returning(["id", "name", "text", "created_at"]);
  return message;
}

export function deleteMessage(id) {
  return db("messages").where({ id }).del();
}
