import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During development every request to /api goes to the Express server.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
