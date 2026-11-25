import { Router } from "express";
import validatePost from "../middleware/validatePost.js";
import checkApiKey from "../middleware/checkApiKey.js";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postsController.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", validatePost, createPost); // Exercise 2: middleware on one route
router.put("/:id", validatePost, updatePost);
router.delete("/:id", checkApiKey, deletePost); // Exercise 3: protected route

export default router;
