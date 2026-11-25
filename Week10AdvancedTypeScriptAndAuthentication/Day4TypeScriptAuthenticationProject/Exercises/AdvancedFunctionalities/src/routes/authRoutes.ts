import bcrypt from "bcrypt";
import { Router, type CookieOptions, type Response } from "express";
import rateLimit from "express-rate-limit";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { clearFailures, loginLimiter, recordFailure } from "../middleware/loginLimiter.js";
import { publicUser, userStore } from "../store.js";
import {
  createAccessToken,
  createRefreshToken,
  revokeRefreshToken,
  consumeRefreshToken,
} from "../tokens.js";
import type { User } from "../types.js";
import { checkPassword, checkUsername, isText } from "../validation.js";

const router = Router();

// Register and login get a much smaller limit, which slows down password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again in 15 minutes" },
});

// The refresh cookie is only sent to /api/auth, never to the other routes.
const REFRESH_COOKIE: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: config.isProduction,
  path: "/api/auth",
};

function sendTokens(res: Response, user: User, status = 200): void {
  res.cookie("refreshToken", createRefreshToken(user), {
    ...REFRESH_COOKIE,
    maxAge: config.refreshLifetimeMs,
  });
  res.status(status).json({ user: publicUser(user), accessToken: createAccessToken(user) });
}

router.post("/register", authLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    res.status(400).json({ error: "username and password are required" });
    return;
  }
  const problems = [...checkUsername(username).problems, ...checkPassword(password).problems];
  if (problems.length > 0) {
    res.status(400).json({ error: "Please fix the following", problems });
    return;
  }
  if (userStore.findByUsername(username)) {
    res.status(409).json({ error: "That username is taken" });
    return;
  }
  const user = userStore.create(username, await bcrypt.hash(password, 12));
  sendTokens(res, user, 201);
});

router.post("/login", authLimiter, loginLimiter, async (req, res) => {
  const { username, password } = req.body ?? {};
  const user = isText(username) ? userStore.findByUsername(username) : undefined;
  const ok =
    user !== undefined && isText(password) && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    recordFailure(req);
    res.status(401).json({ error: "Wrong username or password" });
    return;
  }
  clearFailures(req);
  sendTokens(res, user);
});

// Swap a refresh token for a new pair. The old refresh token can't be used again.
router.post("/refresh", (req, res) => {
  const token: unknown = req.cookies?.refreshToken;
  const userId = typeof token === "string" ? consumeRefreshToken(token) : null;
  const user = userId === null ? undefined : userStore.findById(userId);
  if (!user) {
    res.clearCookie("refreshToken", REFRESH_COOKIE);
    res.status(401).json({ error: "Please log in again" });
    return;
  }
  sendTokens(res, user);
});

router.post("/logout", (req, res) => {
  const token: unknown = req.cookies?.refreshToken;
  if (typeof token === "string") revokeRefreshToken(token);
  res.clearCookie("refreshToken", REFRESH_COOKIE);
  res.json({ message: "Logged out" });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
