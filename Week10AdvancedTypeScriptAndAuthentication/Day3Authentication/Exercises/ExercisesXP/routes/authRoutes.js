import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, me);

export default router;
