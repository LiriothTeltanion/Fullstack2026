// Registration and Login: Express + Knex + bcrypt, two tables in PostgreSQL.
import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRouter.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", userRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
