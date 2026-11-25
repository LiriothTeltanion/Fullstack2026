import { Router } from "express";
import { listNotes, createNote, updateNote, deleteNote } from "../controllers/notesController.js";

const router = Router();

router.get("/", listNotes); // ?q=word searches title and body
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
