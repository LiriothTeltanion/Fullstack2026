// Notes App: a REST API for notes plus the page that uses it.
import express from "express";
import rateLimit from "express-rate-limit";
import notesRouter from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use("/api/notes", notesRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error(err);
  res.status(500).json({ error: "Could not read or save the notes" });
});

app.listen(PORT, () => {
  console.log(`Notes app on http://localhost:${PORT}`);
});
