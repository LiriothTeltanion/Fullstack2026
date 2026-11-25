import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "../models/userModel.js";

const ONE_HOUR = 60 * 60 * 1000;

// The token lives in an httpOnly cookie, so JavaScript in the page can't read it
const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

function sendToken(res, user) {
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { ...cookieOptions, maxAge: ONE_HOUR });
}

// POST /api/auth/register
export async function register(req, res) {
  // req.body is undefined when no JSON was sent, hence the ?? {}
  const { username, email, password } = req.body ?? {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email and password are required." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "The password needs at least 8 characters." });
  }
  if (await findByEmail(email)) {
    return res.status(409).json({ error: "That email is already registered." });
  }

  // 10 salt rounds: slow enough for attackers, fast enough for a login
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ username, email, passwordHash });

  sendToken(res, user);
  res.status(201).json({ user });
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body ?? {};
  const user = email ? await findByEmail(email) : null;

  // Same message for "no such user" and "wrong password", so nobody can guess emails
  const ok = user && (await bcrypt.compare(password || "", user.password_hash));
  if (!ok) {
    return res.status(401).json({ error: "Wrong email or password." });
  }

  sendToken(res, user);
  res.json({ user: { id: user.id, username: user.username, email: user.email } });
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie("token", cookieOptions);
  res.json({ message: "Logged out." });
}
