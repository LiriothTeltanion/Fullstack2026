import app from "./app.js";
import { PORT } from "./settings.js";

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
});
