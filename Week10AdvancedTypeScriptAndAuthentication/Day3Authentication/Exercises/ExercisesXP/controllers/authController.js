import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IS_PRODUCTION, JWT_SECRET, TOKEN_LIFETIME, TOKEN_MAX_AGE_MS } from "../settings.js";
import {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  toPublic,
} from "../models/userModel.js";

const SALT_ROUNDS = 10;
const COOKIE_OPTIONS = { httpOnly: true, sameSite: "strict", secure: IS_PRODUCTION };

const isText = value => typeof value === "string" && value.trim() !== "";

export async function register(req, res) {
  const { username, email, password } = req.body ?? {};

  if (!isText(username) || !isText(email) || !isText(password)) {
    return res.status(400).json({ error: "username, email and password are required" });
  }
  if (!email.includes("@")) {
    return res.status(400).json({ error: "That email doesn't look right" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "The password needs at least 8 characters" });
  }
  if (findByUsername(username) || findByEmail(email)) {
    return res.status(409).json({ error: "That username or email is already taken" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = createUser({ username, email, passwordHash });
  res.status(201).json({ message: "User created", user: toPublic(user) });
}

export async function login(req, res) {
  const { username, password } = req.body ?? {};
  const user = isText(username) ? findByUsername(username) : undefined;

  // Same answer for "no such user" and "wrong password", so usernames can't be probed.
  const passwordOk =
    user && isText(password) && (await bcrypt.compare(password, user.passwordHash));
  if (!passwordOk) {
    return res.status(401).json({ error: "Wrong username or password" });
  }

  const token = jwt.sign({ sub: String(user.id), username: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_LIFETIME,
  });

  res.cookie("token", token, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGE_MS });
  res.json({ message: "Logged in", user: toPublic(user), token });
}

export function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
}

export function me(req, res) {
  const user = findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user: toPublic(user) });
}
