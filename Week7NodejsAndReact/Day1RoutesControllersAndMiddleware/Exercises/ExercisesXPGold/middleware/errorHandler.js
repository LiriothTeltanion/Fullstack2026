// Express knows this is an error handler because it has four parameters.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, next) {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
}
