import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // Locally, /api calls go to the Express server on port 4000
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
});
