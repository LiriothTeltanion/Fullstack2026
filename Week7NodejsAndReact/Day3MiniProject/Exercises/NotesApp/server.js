// Notes App: a REST API for notes plus the page that uses it.
import express from "express";
import notesRouter from "./routes/notes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/api/notes", notesRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Could not read or save the notes" });
});

app.listen(PORT, () => {
  console.log(`Notes app on http://localhost:${PORT}`);
});
