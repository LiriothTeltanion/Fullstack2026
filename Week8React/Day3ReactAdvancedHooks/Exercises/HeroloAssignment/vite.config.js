import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createWeatherProxy } from "./weather-proxy.server.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const install = server => {
    server.middlewares.use(createWeatherProxy({ apiKey: env.ACCUWEATHER_API_KEY }));
  };
  return {
    plugins: [
      react(),
      { name: "local-weather-proxy", configureServer: install, configurePreviewServer: install },
    ],
  };
});
