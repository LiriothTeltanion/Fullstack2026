import "dotenv/config";
import express from "express";
import cors from "cors";
import itemsRouter from "./routes/items.js";
import { checkConnection } from "./db/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Quick check that the API and the database both answer.
app.get("/api/health", async (req, res) => {
  const database = await checkConnection();
  res.json({ status: "ok", database });
});

app.use("/api/items", itemsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Capstone API on http://localhost:${PORT}`);
});
