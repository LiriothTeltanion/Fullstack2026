// Prints one line per request, for example: GET /todos
export default function logger(req, res, next) {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
}
