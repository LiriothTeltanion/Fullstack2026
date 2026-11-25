import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
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

// Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(express.static(publicDir));
app.use("/api/files", filesRouter);

// Express 5 sends errors from async controllers here automatically
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`S3 uploads app on http://localhost:${PORT}`);
});
