import { Router } from "express";
import {
  listBooks,
  showBook,
  addBook,
  editBook,
  removeBook,
} from "../controllers/booksController.js";

const router = Router();
router.param("bookId", (req, res, next, value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  req.params.bookId = id;
  next();
});

router.get("/", listBooks);
router.get("/:bookId", showBook);
router.post("/", addBook);
router.put("/:bookId", editBook);
router.delete("/:bookId", removeBook);

export default router;
