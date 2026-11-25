import { Router } from "express";
import rateLimit from "express-rate-limit";
import { register, login, listUsers, showUser, editUser } from "../controllers/userController.js";

const router = Router();

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
