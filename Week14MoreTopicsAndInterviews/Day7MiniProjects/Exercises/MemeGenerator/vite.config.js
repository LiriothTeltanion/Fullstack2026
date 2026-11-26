import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Vite 8 defaults; the configuration test compares these with installed Vite.
const viteDefaultFileDeny = [
  ".env",
  ".env.*",
  "*.{crt,pem,key,p12,pfx,cer,der}",
  ".npmrc",
  ".yarnrc.yml",
  "**/.git/**",
];

export default defineConfig(({ command, mode, isPreview }) => {
  const classroom = mode === "classroom";
  const stylesheet = fileURLToPath(new URL("./.classroom/App.css", import.meta.url));
  if (classroom && (command !== "serve" || isPreview)) {
    throw new Error("Classroom styles are development-only. Use the normal production build.");
  }
  if (classroom && !existsSync(stylesheet)) {
    throw new Error("Classroom mode needs your private .classroom/App.css. See README.md.");
  }
  return {
    server: {
      ...(classroom && { host: "127.0.0.1" }),
      fs: { deny: [...viteDefaultFileDeny, "**/.classroom/**"] },
    },
    ...(classroom && { preview: { host: "127.0.0.1" } }),
    plugins: [
      react(),
      {
        name: "private-classroom-policy",
        configResolved(config) {
          if (classroom) {
            const loopbackHosts = new Set(["127.0.0.1", "localhost", "::1"]);
            if (!loopbackHosts.has(config.server.host) || !loopbackHosts.has(config.preview.host)) {
              throw new Error("Classroom mode requires a loopback host for server and preview.");
            }
          }
        },
      },
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
