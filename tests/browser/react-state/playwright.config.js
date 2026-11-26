import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "node:url";

const apps = [
  { directory: "DailyChallenge/VotingApp/", port: 43175 },
  { directory: "Exercises/ExercisesXPGold/", port: 43176 },
];

const day = new URL("../../../Week7NodejsAndReact/Day5ReactComponentsAndState/", import.meta.url);

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.js",
  workers: 1,
  use: { channel: process.env.PLAYWRIGHT_CHANNEL || undefined, reducedMotion: "reduce" },
  projects: [
    { name: "narrow", use: { viewport: { width: 320, height: 760 } } },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: apps.map(({ directory, port }) => ({
    cwd: fileURLToPath(new URL(directory, day)),
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
  })),
});
