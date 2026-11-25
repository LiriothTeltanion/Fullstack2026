import type { NextFunction, Request, Response } from "express";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Failed logins per "ip|username": how many and when the window started.
const failures = new Map<string, { count: number; firstAt: number }>();

const keyFor = (req: Request) => `${req.ip}|${String(req.body?.username ?? "").toLowerCase()}`;

// Blocks a client for 15 minutes after 5 wrong passwords for the same username.
export function loginLimiter(req: Request, res: Response, next: NextFunction): void {
  const entry = failures.get(keyFor(req));
  if (entry && Date.now() - entry.firstAt > WINDOW_MS) failures.delete(keyFor(req));

  const current = failures.get(keyFor(req));
  if (current && current.count >= MAX_FAILURES) {
    const retryAfter = Math.ceil((current.firstAt + WINDOW_MS - Date.now()) / 1000);
    res.set("Retry-After", String(retryAfter));
    res.status(429).json({
      error: `Too many failed logins. Try again in ${Math.ceil(retryAfter / 60)} minutes.`,
    });
    return;
  }
  next();
}

export function recordFailure(req: Request): void {
  const key = keyFor(req);
  const entry = failures.get(key);
  failures.set(
    key,
    entry ? { ...entry, count: entry.count + 1 } : { count: 1, firstAt: Date.now() }
  );
}

export function clearFailures(req: Request): void {
  failures.delete(keyFor(req));
}
