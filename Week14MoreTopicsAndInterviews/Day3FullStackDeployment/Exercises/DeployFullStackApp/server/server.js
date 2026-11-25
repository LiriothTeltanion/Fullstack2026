import "dotenv/config";
import { createApp } from "./app.js";
import db from "./db/knex.js";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Copy .env.example to .env for local runs.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Bring the database up to date first. On Render's free plan there is no
// pre-deploy step, so starting the server is the natural moment to migrate.
const [batch, applied] = await db.migrate.latest();
console.log(
  applied.length ? `Migrations batch ${batch}: ${applied.join(", ")}` : "Database is up to date"
);

createApp().listen(PORT, () => {
  console.log(`Guestbook running on http://localhost:${PORT}`);
});
