import pg from "pg";

// One shared pool of connections for the whole app.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export const query = (text, params) => pool.query(text, params);

export async function checkConnection() {
  try {
    await pool.query("SELECT 1");
    return "connected";
  } catch (error) {
    return `not connected (${error.code || error.message})`;
  }
}
