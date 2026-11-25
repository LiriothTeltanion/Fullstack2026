import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IS_PRODUCTION, JWT_SECRET, TOKEN_LIFETIME, TOKEN_MAX_AGE_MS } from "../settings.js";
import { createUser, findUserById, findUserByUsername, toPublicUser } from "../models/userModel.js";

const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict", secure: IS_PRODUCTION };
const isText = value => typeof value === "string" && value.trim() !== "";

function sendSession(res, user, status = 200) {
  const token = jwt.sign({ sub: String(user.id), username: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });
  res.cookie("token", token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE_MS });
  res.status(status).json({ user: toPublicUser(user) });
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
  if (findUserByUsername(username)) {
    return res.status(409).json({ error: "That username is taken" });
  }

  const user = createUser(username, await bcrypt.hash(password, 10));
  sendSession(res, user, 201); // registering also logs you in
}

export async function login(req, res) {
  const { username, password } = req.body ?? {};
  const user = isText(username) ? findUserByUsername(username) : undefined;
  const ok = user && isText(password) && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) return res.status(401).json({ error: "Wrong username or password" });
  sendSession(res, user);
}

export function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export function me(req, res) {
  const user = findUserById(req.user.id);
  if (!user) return res.status(401).json({ error: "Please log in" });
  res.json({ user: toPublicUser(user) });
}
