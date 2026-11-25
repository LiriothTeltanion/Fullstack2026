// Express 5 forwards errors from async handlers here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Server error. Check the logs." });
}
