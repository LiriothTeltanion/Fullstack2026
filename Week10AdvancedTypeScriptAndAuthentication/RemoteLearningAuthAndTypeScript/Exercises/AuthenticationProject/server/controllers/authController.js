import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, TOKEN_LIFETIME } from "../settings.js";
import { createUser, findByEmail, toPublic } from "../models/userModel.js";

const isText = value => typeof value === "string" && value.trim() !== "";
const signToken = user =>
  jwt.sign({ sub: String(user.id) }, JWT_SECRET, { expiresIn: TOKEN_LIFETIME });

export async function register(req, res) {
  const { name, email, password } = req.body ?? {};
  if (!isText(name) || !isText(email) || !isText(password)) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
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
