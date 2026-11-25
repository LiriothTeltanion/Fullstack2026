import app from "./app.js";
import { PORT } from "./settings.js";
import { database } from "./models/database.js";

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log("Auth server listening on http://127.0.0.1:" + server.address().port);
});
function stop() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}
process.once("SIGTERM", stop);
process.once("SIGINT", stop);
