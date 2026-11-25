import { Router } from "express";
import { getMe } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// verifyToken runs before getMe; without a valid token getMe never runs
router.get("/me", verifyToken, getMe);

export default router;
