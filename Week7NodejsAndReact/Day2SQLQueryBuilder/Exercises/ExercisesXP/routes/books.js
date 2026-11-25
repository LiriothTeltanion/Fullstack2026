import { Router } from "express";
import {
  listBooks,
  showBook,
  addBook,
  editBook,
  removeBook,
} from "../controllers/booksController.js";

const router = Router();

router.get("/", listBooks);
router.get("/:bookId", showBook);
router.post("/", addBook);
router.put("/:bookId", editBook);
router.delete("/:bookId", removeBook);

export default router;
