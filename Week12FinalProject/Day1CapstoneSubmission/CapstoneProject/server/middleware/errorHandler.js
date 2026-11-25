// Express knows this is an error handler because it takes four arguments.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
}
