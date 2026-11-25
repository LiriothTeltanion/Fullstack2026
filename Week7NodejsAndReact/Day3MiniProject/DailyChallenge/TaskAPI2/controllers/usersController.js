import bcrypt from "bcrypt";
import { readUsers, updateUsers } from "../models/userStore.js";

const PROFILE_FIELDS = ["name", "lastName", "email", "username"];

function publicUser({ id, name, lastName, email, username }) {
  return { id, name, lastName, email, username };
}

function profileInput(body, partial = false) {
  const input = {};
  for (const field of [...PROFILE_FIELDS, "password"]) {
    if (partial && body[field] === undefined) continue;
    const value = body[field];
    if (typeof value !== "string" || !value.trim()) {
      return { error: `${field} is required` };
    }
    input[field] = field === "password" ? value : value.trim();
  }
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { error: "Please enter a valid email address" };
  }
  // bcrypt only hashes the first 72 bytes. Reject longer input explicitly.
  if (input.password && Buffer.byteLength(input.password, "utf8") > 72) {
    return { error: "Password must fit within 72 UTF-8 bytes" };
  }
  if (Object.keys(input).length === 0) return { error: "Send at least one profile field" };
  return { input };
}

async function uniquenessError(users, input, excludeId) {
  const others = users.filter(user => user.id !== excludeId);
  if (
    input.username &&
    others.some(user => user.username.toLowerCase() === input.username.toLowerCase())
  ) {
    return "That username is already registered";
  }
  // The assignment explicitly rejects a password reused by another demo user.
  if (input.password) {
    for (const user of others) {
      if (await bcrypt.compare(input.password, user.passwordHash)) {
        return "That password is already used by another demo user";
      }
    }
  }
  return null;
}

export async function register(req, res, next) {
  const { input, error } = profileInput(req.body ?? {});
  if (error) return res.status(400).json({ error });
  try {
    const result = await updateUsers(async users => {
      const conflict = await uniquenessError(users, input);
      if (conflict) return { conflict };
      const passwordHash = await bcrypt.hash(input.password, 10);
      const id = Math.max(0, ...users.map(user => user.id)) + 1;
      const user = { id, ...input, passwordHash };
      delete user.password;
      users.push(user);
      return { user: publicUser(user) };
    });
    if (result.conflict) return res.status(409).json({ error: result.conflict });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  const { username, password } = req.body ?? {};
  if (
    typeof username !== "string" ||
    !username.trim() ||
    typeof password !== "string" ||
    !password.trim() ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({ error: "Username and password are required" });
  }
  try {
    const user = (await readUsers()).find(
      candidate => candidate.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    return res.json({ message: "Login successful", user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    res.json((await readUsers()).map(publicUser));
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const user = (await readUsers()).find(candidate => candidate.id === Number(req.params.id));
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(publicUser(user));
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req, res, next) {
  const { input, error } = profileInput(req.body ?? {}, true);
  if (error) return res.status(400).json({ error });
  try {
    const result = await updateUsers(async users => {
      const user = users.find(candidate => candidate.id === Number(req.params.id));
      if (!user) return { missing: true };
      const conflict = await uniquenessError(users, input, user.id);
      if (conflict) return { conflict };
      for (const field of PROFILE_FIELDS) {
        if (input[field] !== undefined) user[field] = input[field];
      }
      if (input.password) user.passwordHash = await bcrypt.hash(input.password, 10);
      return { user: publicUser(user) };
    });
    if (result.missing) return res.status(404).json({ error: "User not found" });
    if (result.conflict) return res.status(409).json({ error: result.conflict });
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
