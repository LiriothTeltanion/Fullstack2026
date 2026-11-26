import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const app = new URL(
  "../../../Week9Redux/Day4ReduxToolkitAsync/Exercises/ExercisesXPNinja/",
  import.meta.url
);

export default defineConfig({
  testDir: ".",
  testMatch: "redux-query.checks.js",
  workers: 1,
  use: { channel: process.env.PLAYWRIGHT_CHANNEL || undefined, reducedMotion: "reduce" },
  projects: [
    { name: "narrow", use: { viewport: { width: 320, height: 900 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    cwd: fileURLToPath(app),
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 43179 --strictPort",
    url: "http://127.0.0.1:43179",
    reuseExistingServer: false,
  },
});
