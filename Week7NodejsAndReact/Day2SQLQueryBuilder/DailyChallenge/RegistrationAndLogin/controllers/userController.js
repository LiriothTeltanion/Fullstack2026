import bcrypt from "bcryptjs";
import * as User from "../models/userModel.js";

const SALT_ROUNDS = 10;
const isText = value => typeof value === "string" && value.trim() !== "";
function isEmail(value) {
  if (!isText(value) || value.trim().length > 255 || /\s/.test(value.trim())) return false;
  const parts = value.trim().split("@");
  return (
    parts.length === 2 &&
    parts[0].length > 0 &&
    parts[1].includes(".") &&
    parts[1].split(".").every(part => part.length > 0)
  );
}

export async function register(req, res, next) {
  const { email, username, password, first_name, last_name } = req.body ?? {};
  if (!isEmail(email) || !isText(username) || username.trim().length > 50 || !isText(password)) {
    return res.status(400).json({ error: "A valid email, username and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "password needs at least 6 characters" });
  }
  for (const value of [first_name, last_name]) {
    if (value !== undefined && value !== null && (typeof value !== "string" || value.length > 50)) {
      return res.status(400).json({ error: "Names must be text of at most 50 characters" });
    }
  }
  try {
    const existing = await User.findByUsernameOrEmail(username.trim(), email.trim());
    if (existing) {
      return res.status(409).json({ error: "Username or email already taken" });
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.createUser(
      { email: email.trim(), username: username.trim(), first_name, last_name },
      hash
    );
    res.status(201).json({ message: `Hello ${user.username}, your account is now created`, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  const { username, password } = req.body ?? {};
  if (!isText(username) || !isText(password)) {
    return res.status(400).json({ error: "username and password are required" });
  }
  try {
    const row = await User.getPasswordHash(username.trim());
    // Same message for "no user" and "wrong password", so nobody can guess usernames.
    const ok = row && (await bcrypt.compare(password, row.password));
    if (!ok) {
      return res.status(401).json({ error: "Username or password incorrect" });
    }
    res.json({ message: `Hi ${username} welcome back again!` });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    res.json(await User.getAllUsers());
  } catch (err) {
    next(err);
  }
}

export async function showUser(req, res, next) {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function editUser(req, res, next) {
  const changes = {};
  for (const field of ["email", "first_name", "last_name"]) {
    if (req.body?.[field] !== undefined) {
      const value = req.body[field];
      if (field === "email" && !isEmail(value))
        return res.status(400).json({ error: "A valid email is required" });
      if (field !== "email" && value !== null && (typeof value !== "string" || value.length > 50)) {
        return res.status(400).json({ error: "Names must be text of at most 50 characters" });
      }
      changes[field] = typeof value === "string" ? value.trim() : value;
    }
  }
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: "Send email, first_name or last_name" });
  }
  try {
    const user = await User.updateUser(req.params.id, changes);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
}
