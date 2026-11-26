import { createQuizApp } from "./quiz-app.js";

const port = Number(process.env.PORT ?? 3021);
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new Error("PORT must be an integer from 0 to 65535.");
const host = process.env.HOST ?? "127.0.0.1";
const server = createQuizApp().listen(port, host, () => {
  console.log("Quiz server on http://" + host + ":" + server.address().port);
});
server.on("error", error => {
  console.error("Could not start quiz server: " + error.message);
  process.exitCode = 1;
});
