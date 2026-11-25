import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // During development React runs on 5173 and Express on 3000
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
