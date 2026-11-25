import app from "./app.js";
import { PORT } from "./settings.js";

app.listen(PORT, () => {
  console.log(`Auth API on http://localhost:${PORT}`);
});
