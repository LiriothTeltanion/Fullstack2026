import { Router } from "express";
import { getAllTips, getRandomTip, getTipById } from "../controllers/tipsController.js";

const router = Router();

router.get("/", getAllTips);
// "/random" must come before "/:id", or Express would treat "random" as an id
router.get("/random", getRandomTip);
router.get("/:id", getTipById);

export default router;
