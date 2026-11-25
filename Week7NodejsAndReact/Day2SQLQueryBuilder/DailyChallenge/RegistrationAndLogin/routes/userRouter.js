import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, listUsers, showUser, editUser } from "../controllers/userController.js";

const router = Router();
router.param("id", (req, res, next, value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647)
    return res.status(400).json({ error: "Invalid ID" });
  req.params.id = id;
  next();
});

// Register and login get a much smaller limit, which slows down password guessing.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many attempts, please try again in 15 minutes" },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/users", listUsers);
router.get("/users/:id", showUser);
router.put("/users/:id", editUser);

export default router;
