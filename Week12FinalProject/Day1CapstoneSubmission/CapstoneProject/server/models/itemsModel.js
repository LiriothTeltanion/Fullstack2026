import { query } from "../db/index.js";

// Every SQL statement for the items table lives here.
export async function findAll() {
  const { rows } = await query("SELECT * FROM items ORDER BY id");
  return rows;
}

export async function create(title) {
  const { rows } = await query("INSERT INTO items (title) VALUES ($1) RETURNING *", [title]);
  return rows[0];
}

export async function toggle(id) {
  const { rows } = await query("UPDATE items SET done = NOT done WHERE id = $1 RETURNING *", [id]);
  return rows[0];
}

export async function remove(id) {
  const { rowCount } = await query("DELETE FROM items WHERE id = $1", [id]);
  return rowCount > 0;
}
