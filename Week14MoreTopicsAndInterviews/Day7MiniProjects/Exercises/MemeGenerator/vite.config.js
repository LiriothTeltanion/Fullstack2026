import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export default defineConfig(({ command, mode }) => {
  const classroom = mode === "classroom";
  const stylesheet = fileURLToPath(new URL("./.classroom/App.css", import.meta.url));
  if (classroom && command !== "serve") {
    throw new Error("Classroom styles are development-only. Use the normal production build.");
  }
  if (classroom && !existsSync(stylesheet)) {
    throw new Error("Classroom mode needs your private .classroom/App.css. See README.md.");
  }
  return {
    plugins: [
      react(),
      classroom && {
        name: "local-classroom-styles",
        // Only the explicit development mode can serve the ignored local file.
        // Normal builds never read or copy it into the public output.
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            if (request.url?.split("?")[0] !== "/__classroom-reference.css") return next();
            response.setHeader("Content-Type", "text/css; charset=utf-8");
            response.setHeader("Cache-Control", "no-store");
            response.end(readFileSync(stylesheet, "utf8"));
          });
        },
        transformIndexHtml() {
          return [
            {
              tag: "link",
              attrs: { rel: "stylesheet", href: "/__classroom-reference.css" },
              injectTo: "head-prepend",
            },
          ];
        },
      },
    ],
  };
});
