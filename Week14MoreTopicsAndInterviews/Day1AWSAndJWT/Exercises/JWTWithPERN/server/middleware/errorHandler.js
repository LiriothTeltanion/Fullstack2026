// Last middleware: any error thrown in a controller ends up here.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);

  // 23505 is PostgreSQL's "unique violation" (for example a taken username)
  if (err.code === "23505") {
    return res.status(409).json({ error: "That username or email is already taken." });
  }

  res.status(500).json({ error: "Server error." });
}
