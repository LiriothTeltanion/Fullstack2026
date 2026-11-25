// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  console.error("Task API request failed:", err.code || err.name);
  res.status(500).json({ error: "Server error" });
}
