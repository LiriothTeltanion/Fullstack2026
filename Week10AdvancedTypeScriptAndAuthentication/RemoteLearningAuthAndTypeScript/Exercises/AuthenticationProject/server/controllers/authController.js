import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_LIFETIME } from "../settings.js";
import { createUser, findByEmail, toPublic } from "../models/userModel.js";

const isText = value => typeof value === "string" && value.trim() !== "";

// No part of this pattern can match the same characters two ways (the name has no "@",
// each domain label has no "."), so it runs in linear time even on a huge input.
// The length check comes first anyway: 254 characters is the longest valid address.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
const isEmail = value => value.length <= 254 && EMAIL_PATTERN.test(value);

const signToken = user =>
  jwt.sign({ sub: String(user.id) }, JWT_SECRET, { expiresIn: TOKEN_LIFETIME });

export async function register(req, res) {
  const { name, email, password } = req.body ?? {};
  if (!isText(name) || !isText(email) || !isText(password)) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "The password needs at least 8 characters" });
  }
  if (findByEmail(email)) {
    return res.status(409).json({ error: "An account with that email already exists" });
  }
  const user = createUser({ name, email, passwordHash: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: signToken(user), user: toPublic(user) });
}

export async function login(req, res) {
  const { email, password } = req.body ?? {};
  const user = isText(email) ? findByEmail(email) : undefined;
  const ok = user && isText(password) && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    return res.status(401).json({ error: "Wrong email or password" });
  }
  res.json({ token: signToken(user), user: toPublic(user) });
}
