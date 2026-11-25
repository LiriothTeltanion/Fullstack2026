import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
