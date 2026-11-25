import { Router } from "express";
import { createMessage, listMessages, removeMessage } from "../controllers/messagesController.js";

const router = Router();

router.get("/", listMessages);
router.post("/", createMessage);
router.delete("/:id", removeMessage);

export default router;
