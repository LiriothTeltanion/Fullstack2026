import { Router } from "express";
import rateLimit from "express-rate-limit";
import { confirm, login, logout, me, refresh, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
function limiter(limit) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { error: "Too many attempts, please try again in 15 minutes" },
  });
}
router.post("/register", limiter(10), register);
router.post("/confirm-email", limiter(10), confirm);
router.post("/login", limiter(10), login);
router.post("/refresh", limiter(30), refresh);
router.post("/logout", logout);
router.get("/me", verifyToken, me);
router.get("/profile", verifyToken, me);
export default router;
