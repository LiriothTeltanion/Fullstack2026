import "dotenv/config";
import express from "express";
import rateLimit from "express-rate-limit";
import cors from "cors";
import apiRouter from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
