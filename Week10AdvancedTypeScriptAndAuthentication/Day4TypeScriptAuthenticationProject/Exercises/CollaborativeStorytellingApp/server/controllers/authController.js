import {
  createRefreshSession,
  rotateRefreshSession,
  deleteRefreshSession,
} from "../models/refreshModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IS_PRODUCTION, JWT_SECRET, TOKEN_LIFETIME, TOKEN_MAX_AGE_MS } from "../settings.js";
import { createUser, findUserById, findUserByUsername, toPublicUser } from "../models/userModel.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict", secure: IS_PRODUCTION };
const isText = value => typeof value === "string" && value.trim() !== "";

async function sendSession(res, user, status = 200, session) {
  const stored = session ?? (await createRefreshSession(user.id));
  const accessToken = jwt.sign(
    { sub: String(user.id), username: user.username, kind: "access" },
    JWT_SECRET,
    { expiresIn: TOKEN_LIFETIME }
  );
  const refreshToken = jwt.sign(
    { sub: String(user.id), kind: "refresh", jti: stored.id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.clearCookie("token", COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * TOKEN_MAX_AGE_MS * 12,
  });
  res.status(status).json({ user: toPublicUser(user), accessToken });
}

export async function refresh(req, res) {
  try {
    const token = jwt.verify(req.cookies?.refreshToken ?? "", JWT_SECRET);
    if (token.kind !== "refresh" || !token.jti)
      return res.status(401).json({ error: "Please log in" });
    const session = await rotateRefreshSession(token.jti);
    if (!session) return res.status(401).json({ error: "Please log in" });
    const user = await findUserById(session.userId);
    if (!user) return res.status(401).json({ error: "Please log in" });
    return sendSession(res, user, 200, session);
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Please log in" });
    }
    throw error;
  }
}

export async function register(req, res) {
  const { username, password } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  if (!/^[a-z0-9_]{3,20}$/i.test(username.trim())) {
    return res.status(400).json({ error: "Username: 3 to 20 letters, numbers or _" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password: at least 8 characters" });
  }
  if (await findUserByUsername(username)) {
    return res.status(409).json({ error: "That username is taken" });
  }

  const user = await createUser(username, await bcrypt.hash(password, 10));
  await sendSession(res, user, 201); // registering also logs you in
}

export async function login(req, res) {
  const { username, password } = req.body ?? {};
  const user = isText(username) ? await findUserByUsername(username) : undefined;
  const ok = user && isText(password) && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: "Wrong username or password" });
  await sendSession(res, user);
}

export async function logout(req, res) {
  try {
    const token = jwt.verify(req.cookies?.refreshToken ?? "", JWT_SECRET);
    if (token.kind === "refresh" && token.jti) await deleteRefreshSession(token.jti);
  } catch (error) {
    if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") throw error;
  }
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export async function me(req, res) {
  const user = await findUserById(req.user.id);
  if (!user) return res.status(401).json({ error: "Please log in" });
  res.json({ user: toPublicUser(user) });
}
