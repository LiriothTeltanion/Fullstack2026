import { Router } from "express";
import { getAllUsers } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

// Every route in this file needs a valid token.
router.use(verifyToken);
router.get("/", getAllUsers);

export default router;
