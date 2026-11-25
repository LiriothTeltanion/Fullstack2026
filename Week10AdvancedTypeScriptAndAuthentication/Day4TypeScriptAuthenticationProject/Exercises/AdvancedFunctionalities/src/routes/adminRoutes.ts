import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { publicUser, userStore } from "../store.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));

router.get("/users", (req, res) => {
  res.json({ users: userStore.all().map(publicUser) });
});

router.patch("/users/:id/role", (req, res) => {
  const role: unknown = req.body?.role;
  if (role !== "user" && role !== "admin") {
    res.status(400).json({ error: 'role must be "user" or "admin"' });
    return;
  }
  const user = userStore.findById(Number(req.params.id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (user.id === req.user?.id && role !== "admin") {
    res.status(400).json({ error: "You can't remove your own admin role" });
    return;
  }
  user.role = role;
  res.json({ user: publicUser(user) });
});

export default router;
