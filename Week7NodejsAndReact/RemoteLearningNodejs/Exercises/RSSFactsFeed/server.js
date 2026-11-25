// RSS Facts Feed: Express renders an RSS feed with EJS and lets me search it.
import "dotenv/config";
import express from "express";
import feedRouter from "./routes/feed.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); // reads the search forms
app.use(express.static("public"));
app.use("/", feedRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(502).render("pages/error", { title: "Feed unavailable", message: err.message });
});

app.listen(PORT, () => {
  console.log(`RSS feed app on http://localhost:${PORT}`);
});
