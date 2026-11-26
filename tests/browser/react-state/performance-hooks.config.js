import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

export default defineConfig({
  testDir: ".",
  testMatch: "performance-hooks.checks.js",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:43183",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 320, height: 900 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    cwd: fileURLToPath(new URL("../../../Week8React/Day3ReactAdvancedHooks/Exercises/ExercisesXPNinja/", import.meta.url)),
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 43183 --strictPort",
    url: "http://127.0.0.1:43183",
  },
});
