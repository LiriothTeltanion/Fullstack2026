import { findById } from "../models/userModel.js";

// GET /api/users/me (protected: verifyToken runs first and sets req.user)
export async function getMe(req, res) {
  const user = await findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }
  res.json({ user });
}
