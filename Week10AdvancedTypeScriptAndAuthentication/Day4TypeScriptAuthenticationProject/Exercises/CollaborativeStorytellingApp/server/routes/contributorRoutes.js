import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  findStory,
  findContributor,
  listContributors,
  removeContributor,
} from "../models/storyModel.js";
import { addContributor } from "../controllers/storiesController.js";

const router = Router();
router.use(requireAuth);
router.post(
  "/",
  async (req, res, next) => {
    req.story = await findStory(Number(req.body?.story_id));
    if (!req.story) return res.status(404).json({ error: "Story not found" });
    next();
  },
  addContributor
);
router.get("/:story_id", async (req, res) => {
  const story = await findStory(Number(req.params.story_id));
  if (!story) return res.status(404).json({ error: "Story not found" });
  res.json({ contributors: await listContributors(story.id) });
});
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1)
    return res.status(404).json({ error: "Contributor not found" });
  const item = await findContributor(id);
  if (!item) return res.status(404).json({ error: "Contributor not found" });
  const story = await findStory(item.storyId);
  if (!story || story.authorId !== req.user.id)
    return res.status(403).json({ error: "Only the author can remove contributors" });
  await removeContributor(item);
  res.status(204).end();
});
export default router;
