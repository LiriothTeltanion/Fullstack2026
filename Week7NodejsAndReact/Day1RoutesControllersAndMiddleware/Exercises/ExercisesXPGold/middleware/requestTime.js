// Adds the request time to req and logs how long each response took.
export default function requestTime(req, res, next) {
  req.startMs = Date.now();
  req.requestTime = new Date(req.startMs).toISOString();
  res.on("finish", () => {
    const ms = Date.now() - req.startMs;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms} ms)`);
  });
  next();
}
