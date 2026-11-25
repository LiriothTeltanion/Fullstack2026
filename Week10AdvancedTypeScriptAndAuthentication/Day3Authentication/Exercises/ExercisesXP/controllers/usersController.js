import { listUsers, toPublic } from "../models/userModel.js";

export function getAllUsers(req, res) {
  res.json({ users: listUsers().map(toPublic), requestedBy: req.user.username });
}
