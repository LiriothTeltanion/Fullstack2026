// In-memory data: no database, so the service can run on Render's free plan as-is
export const tips = [
  { id: 1, text: "Read PORT from process.env. Render chooses the port, not you." },
  { id: 2, text: "Keep secrets in environment variables, never in the repository." },
  { id: 3, text: "Add a /api/health route so Render knows the service is alive." },
  {
    id: 4,
    text: "A free web service sleeps after 15 idle minutes; the first request wakes it up.",
  },
  { id: 5, text: "Vite only exposes variables that start with VITE_ to the browser." },
  { id: 6, text: "Static sites need a rewrite to index.html, or a refresh on /about returns 404." },
  { id: 7, text: "Check the deploy logs first when something breaks after a push." },
];
