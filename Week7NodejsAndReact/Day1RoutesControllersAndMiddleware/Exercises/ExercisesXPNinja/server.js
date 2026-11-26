// Start the greeting form and the original users API through the normal entry point.
import { createApp } from "./app.js";

const app = createApp();
const PORT = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(PORT) || PORT < 0 || PORT > 65535) {
  throw new Error("PORT must be an integer from 0 to 65535.");
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${server.address().port}`);
});
