import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const app = new URL(
  "../../../Week10AdvancedTypeScriptAndAuthentication/Day1UsingTypeScriptWithReact/Exercises/ExercisesXPGold/",
  import.meta.url
);

export default defineConfig({
  testDir: ".",
  testMatch: "typed-shopping.checks.js",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:43182",
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 320, height: 900 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    cwd: fileURLToPath(app),
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 43182 --strictPort",
    url: "http://127.0.0.1:43182",
  },
});
