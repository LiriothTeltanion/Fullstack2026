import { Router } from "express";
import {
  getComments,
  postComment,
  patchComment,
  removeComment,
  getCommentCapabilities,
  getCommentSettings,
  patchCommentSettings,
} from "../controllers/commentsController.js";
import {
  addContributor,
  getStories,
  patchStory,
  postStory,
  removeStory,
} from "../controllers/storiesController.js";
import { loadStory } from "../middleware/loadStory.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);
router.get("/", getStories);
router.get("/comment-capabilities", getCommentCapabilities);
router.post("/", postStory);
// Any authenticated reader can see the existing story list and join its comments.
// Commenting does not grant permission to edit the story or its contributors.
router.get("/:id/comment-settings", loadStory, getCommentSettings);
router.patch("/:id/comment-settings", loadStory, patchCommentSettings);
router.get("/:id/comments", loadStory, getComments);
router.post("/:id/comments", loadStory, postComment);
router.patch("/:id/comments/:commentId", loadStory, patchComment);
router.delete("/:id/comments/:commentId", loadStory, removeComment);
router.patch("/:id", loadStory, patchStory);
router.delete("/:id", loadStory, removeStory);
router.post("/:id/contributors", loadStory, addContributor);

export default router;
