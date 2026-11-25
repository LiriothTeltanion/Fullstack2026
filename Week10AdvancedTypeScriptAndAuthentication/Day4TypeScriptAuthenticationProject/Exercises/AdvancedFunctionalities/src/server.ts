import app from "./app.js";
import { config } from "./config.js";

app.listen(config.port, () => {
  console.log(`Advanced auth API on http://localhost:${config.port}`);
});
