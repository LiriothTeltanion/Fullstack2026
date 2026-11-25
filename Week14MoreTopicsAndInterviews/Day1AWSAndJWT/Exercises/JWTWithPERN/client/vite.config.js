import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The proxy sends /api calls to Express, so the browser sees one origin
// and the httpOnly cookie works without any CORS setup.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
