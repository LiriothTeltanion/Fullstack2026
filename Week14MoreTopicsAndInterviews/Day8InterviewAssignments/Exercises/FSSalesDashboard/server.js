import { fileURLToPath } from "node:url";
import { createDashboard } from "./app.js";
const database =
  process.env.SALES_DB ?? fileURLToPath(new URL("./data/sales.sqlite", import.meta.url));
const { app, db } = createDashboard(database);
const server = app.listen(Number(process.env.PORT ?? 3000), "127.0.0.1", () => {
  console.log("Sales dashboard at http://127.0.0.1:" + server.address().port);
});
function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
