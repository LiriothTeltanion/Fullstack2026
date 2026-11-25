import app from "./app.js";
const PORT = Number(process.env.PORT) || 3030;
app.listen(PORT, () => console.log("Emoji game on port " + PORT));
