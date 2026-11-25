import { Router } from "express";
import {
  listPosts,
  showPost,
  addPost,
  editPost,
  removePost,
} from "../controllers/postsController.js";

const router = Router();
router.param("id", (req, res, next, value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  req.params.id = id;
  next();
});

router.get("/", listPosts);
router.get("/:id", showPost);
router.post("/", addPost);
router.put("/:id", editPost);
router.delete("/:id", removePost);

export default router;
