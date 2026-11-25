// A tiny rate limiter. The function returns a middleware, so the limits
// can change per app. Counts live in memory and reset every window.
export default function rateLimit({ windowMs, max }) {
  const hits = new Map(); // ip -> { count, resetAt }

  return function limiter(req, res, next) {
    const now = Date.now();
    const entry = hits.get(req.ip);

    if (!entry || now > entry.resetAt) {
      hits.set(req.ip, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > max) {
      const seconds = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(seconds));
      return res.status(429).json({ error: `Too many requests, try again in ${seconds}s` });
    }
    next();
  };
}
