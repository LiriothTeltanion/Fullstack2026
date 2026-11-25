import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  IS_PRODUCTION,
  JWT_SECRET,
  REFRESH_SECRET,
  TOKEN_LIFETIME,
  TOKEN_MAX_AGE_MS,
  REFRESH_MAX_AGE_MS,
  LOCAL_CONFIRMATION,
  TOKEN_ISSUER,
} from "../settings.js";
import {
  createUser,
  confirmEmail,
  findByEmail,
  findById,
  findByUsername,
  toPublic,
} from "../models/userModel.js";
import {
  activeSession,
  createSession,
  revokeSession,
  rotateSession,
} from "../models/sessionModel.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict", secure: IS_PRODUCTION, path: "/" };
const REFRESH_COOKIE_OPTIONS = { ...COOKIE_OPTIONS, path: "/api/auth" };
const DUMMY_HASH = bcrypt.hashSync("Public sample for timing comparison", 10);
const digest = token => createHash("sha256").update(token).digest("hex");
const isText = value => typeof value === "string" && value.trim() !== "";

function tokens(user, sessionId, refreshId, expiresAt) {
  const token = jwt.sign(
    { sub: String(user.id), username: user.username, sid: sessionId, type: "access" },
    JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: TOKEN_LIFETIME,
      issuer: TOKEN_ISSUER,
      audience: "access",
    }
  );
  const refresh = jwt.sign(
    { sub: String(user.id), sid: sessionId, jti: refreshId, type: "refresh" },
    REFRESH_SECRET,
    {
      algorithm: "HS256",
      expiresIn: Math.max(1, Math.floor((expiresAt - Date.now()) / 1000)),
      issuer: TOKEN_ISSUER,
      audience: "refresh",
    }
  );
  return { token, refresh };
}
function setCookies(res, pair, expiresAt) {
  res.cookie("token", pair.token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE_MS });
  res.cookie("refresh_token", pair.refresh, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: Math.max(0, expiresAt - Date.now()),
  });
}
function clearCookies(res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.clearCookie("refresh_token", REFRESH_COOKIE_OPTIONS);
}
export async function register(req, res) {
  const { username, email, password } = req.body ?? {};
  if (
    !isText(username) ||
    !/^[a-zA-Z0-9_.-]{3,32}$/.test(username.trim()) ||
    !isText(email) ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !isText(password) ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      error:
        "Provide a 3–32 character username, valid email and password of at least 8 characters and at most 72 UTF-8 bytes.",
    });
  }
  if (!LOCAL_CONFIRMATION)
    return res
      .status(503)
      .json({ error: "An email delivery transport must be configured before registration." });
  if (findByUsername(username) || findByEmail(email))
    return res.status(409).json({ error: "That username or email is already taken" });
  const passwordHash = await bcrypt.hash(password, 10);
  const confirmationToken = randomBytes(32).toString("hex");
  try {
    const user = createUser({
      username,
      email,
      passwordHash,
      confirmationDigest: digest(confirmationToken),
      confirmationExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    // Local exercise mode hands the token to this client. It sends no email.
    return res.status(201).json({
      message: "User created. Confirm the email before logging in.",
      user: toPublic(user),
      developmentConfirmation: {
        token: confirmationToken,
        endpoint: "/api/auth/confirm-email",
        expiresInHours: 24,
      },
    });
  } catch (error) {
    if (String(error.message).includes("UNIQUE"))
      return res.status(409).json({ error: "That username or email is already taken" });
    throw error;
  }
}
export function confirm(req, res) {
  const token = req.body?.token;
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token) || !confirmEmail(digest(token))) {
    return res
      .status(400)
      .json({ error: "The confirmation token is invalid, expired or already used." });
  }
  res.json({ message: "Email confirmed. You can now log in." });
}
export async function login(req, res) {
  const { username, password } = req.body ?? {};
  if (!isText(password) || Buffer.byteLength(password, "utf8") > 72)
    return res.status(401).json({ error: "Wrong username or password" });
  const user = isText(username) ? findByUsername(username) : undefined;
  const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return res.status(401).json({ error: "Wrong username or password" });
  if (!user.emailVerified)
    return res.status(403).json({ error: "Confirm your email before logging in." });
  const sessionId = randomUUID();
  const refreshId = randomUUID();
  const expiresAt = Date.now() + REFRESH_MAX_AGE_MS;
  const pair = tokens(user, sessionId, refreshId, expiresAt);
  createSession(sessionId, user.id, refreshId, expiresAt);
  setCookies(res, pair, expiresAt);
  res.json({ message: "Logged in", user: toPublic(user), token: pair.token });
}
export function refresh(req, res) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) throw new Error("Missing refresh cookie");
    const payload = jwt.verify(token, REFRESH_SECRET, {
      algorithms: ["HS256"],
      issuer: TOKEN_ISSUER,
      audience: "refresh",
    });
    const session = activeSession(payload.sid);
    const user = findById(Number(payload.sub));
    if (
      payload.type !== "refresh" ||
      !session ||
      session.userId !== user?.id ||
      !user.emailVerified
    )
      throw new Error("Inactive session");
    if (session.refreshId !== payload.jti) {
      revokeSession(session.id);
      throw new Error("Refresh token reuse");
    }
    const refreshId = randomUUID();
    const pair = tokens(user, session.id, refreshId, session.expiresAt);
    if (!rotateSession(session.id, payload.jti, refreshId)) {
      revokeSession(session.id);
      throw new Error("Concurrent refresh token reuse");
    }
    setCookies(res, pair, session.expiresAt);
    res.json({ message: "Session refreshed", token: pair.token });
  } catch {
    clearCookies(res);
    res.status(401).json({ error: "Refresh failed. Please log in again." });
  }
}
export function logout(req, res) {
  const header = req.get("Authorization");
  const bearer = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  for (const [token, key, audience] of [
    [req.cookies?.refresh_token, REFRESH_SECRET, "refresh"],
    [bearer ?? req.cookies?.token, JWT_SECRET, "access"],
  ]) {
    if (!token) continue;
    try {
      const payload = jwt.verify(token, key, {
        algorithms: ["HS256"],
        issuer: TOKEN_ISSUER,
        audience,
        ignoreExpiration: true,
      });
      if (typeof payload.sid === "string") revokeSession(payload.sid);
    } catch {
      /* Invalid tokens still have their browser cookies cleared. */
    }
  }
  clearCookies(res);
  res.json({ message: "Logged out" });
}
export function me(req, res) {
  const user = findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublic(user) });
}
