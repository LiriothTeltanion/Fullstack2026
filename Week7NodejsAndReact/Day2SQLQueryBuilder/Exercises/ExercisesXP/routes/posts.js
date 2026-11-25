import { Router } from "express";
import {
  listPosts,
  showPost,
  addPost,
  editPost,
  removePost,
} from "../controllers/postsController.js";

const router = Router();

router.get("/", listPosts);
router.get("/:id", showPost);
router.post("/", addPost);
router.put("/:id", editPost);
router.delete("/:id", removePost);

export default router;
