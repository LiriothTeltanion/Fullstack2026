import app from "./app.js";
import { PORT } from "./settings.js";

app.listen(PORT, () => {
  console.log(`Storytelling API on http://localhost:${PORT}`);
});
