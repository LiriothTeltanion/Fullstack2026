import { Router } from "express";
import { addItem, deleteItem, getItems, toggleItem } from "../controllers/itemsController.js";

const router = Router();

router.get("/", getItems);
router.post("/", addItem);
router.patch("/:id/toggle", toggleItem);
router.delete("/:id", deleteItem);

export default router;
