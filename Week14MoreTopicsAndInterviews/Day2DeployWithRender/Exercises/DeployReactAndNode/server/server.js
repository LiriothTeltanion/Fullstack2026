import "dotenv/config";
import { createApp } from "./app.js";

// Render sets PORT for us; 4000 is only for running on my laptop
const PORT = process.env.PORT || 4000;

createApp().listen(PORT, () => {
  console.log(`Tips API listening on port ${PORT}`);
});
