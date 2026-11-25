import { createFixture } from "./db/fixture.js";
import { createUserModel } from "./userModel.js";
import { createApp } from "./app.js";

const fixture = await createFixture();
const port = Number(process.env.PORT) || 3014;
const server = createApp(createUserModel(fixture.db)).listen(port, "127.0.0.1", () =>
  console.log("Development PostgreSQL fixture API on port " + port)
);
let closing = false;
async function shutdown() {
  if (closing) return;
  closing = true;
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  await fixture.close();
}
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
