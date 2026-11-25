import { Router } from "express";
import { getProfile, putProfile } from "../controllers/profileController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", getProfile);
router.put("/", putProfile);

export default router;
