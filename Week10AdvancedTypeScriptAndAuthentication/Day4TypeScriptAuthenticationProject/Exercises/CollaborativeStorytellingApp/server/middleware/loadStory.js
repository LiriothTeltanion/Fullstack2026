import { findStory } from "../models/storyModel.js";

// Finds the story from :id once, so each controller can use req.story.
export function loadStory(req, res, next) {
  const story = findStory(Number(req.params.id));
  if (!story) return res.status(404).json({ error: "Story not found" });
  req.story = story;
  next();
}
