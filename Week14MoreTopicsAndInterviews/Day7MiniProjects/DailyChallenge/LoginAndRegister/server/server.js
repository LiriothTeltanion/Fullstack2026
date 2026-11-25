import { createDatabase } from "./db.js";
import { createUserModel } from "./userModel.js";
import { createApp } from "./app.js";

const db = createDatabase();
const port = Number(process.env.PORT) || 3014;
const server = createApp(createUserModel(db)).listen(port, () =>
  console.log("Login API on port " + port)
);

async function shutdown() {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await db.destroy();
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
