import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { errorHandler } from "./middleware/errorHandler.js";
import filesRouter from "./routes/files.js";

// Stop early with a clear message instead of a confusing AWS error later
const required = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET"];
const missing = required.filter(name => !process.env[name]);
if (missing.length > 0) {
  console.error(
    `Missing environment variables: ${missing.join(", ")}. Copy .env.example to .env first.`
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// The path is built from this file, so it works no matter where node is started
const publicDir = fileURLToPath(new URL("./public", import.meta.url));
app.use(express.static(publicDir));
app.use("/api/files", filesRouter);

// Express 5 sends errors from async controllers here automatically
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`S3 uploads app on http://localhost:${PORT}`);
});
