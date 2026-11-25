import { findById, toPublic, updateProfile } from "../models/userModel.js";

export function getProfile(req, res) {
  const user = findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublic(user) });
}

export function putProfile(req, res) {
  const user = findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: toPublic(updateProfile(user, req.body ?? {})) });
}
