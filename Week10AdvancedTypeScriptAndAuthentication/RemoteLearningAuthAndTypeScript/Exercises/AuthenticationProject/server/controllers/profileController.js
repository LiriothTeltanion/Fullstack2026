import { findById, toPublic, updateProfile } from "../models/userModel.js";

export function getProfile(req, res) {
  const user = findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublic(user) });
}

export function putProfile(req, res) {
  const user = findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  const changes = req.body ?? {};
  // Reject the whole update before changing bio when a supplied name is invalid.
  if (
    Object.hasOwn(changes, "name") &&
    (typeof changes.name !== "string" || !changes.name.trim())
  ) {
    return res.status(400).json({ error: "Name must contain at least one non-space character" });
  }
  res.json({ user: toPublic(updateProfile(user, changes)) });
}
