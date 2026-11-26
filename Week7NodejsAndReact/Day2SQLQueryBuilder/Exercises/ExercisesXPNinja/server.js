// Normal entry point: the SQL connection and listening socket stay here.
import "dotenv/config";
import db from "./db/db.js";
import { createApp } from "./app.js";

const app = createApp(db);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
