import { Router } from "express";
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
router.post("/", postStory);
router.patch("/:id", loadStory, patchStory);
router.delete("/:id", loadStory, removeStory);
router.post("/:id/contributors", loadStory, addContributor);

export default router;
