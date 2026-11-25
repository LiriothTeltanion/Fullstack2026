import {
  canEdit,
  createStory,
  deleteStory,
  listStories,
  toPublicStory,
  updateStory,
} from "../models/storyModel.js";
import { findUserByUsername } from "../models/userModel.js";

const isText = value => typeof value === "string" && value.trim() !== "";

export function getStories(req, res) {
  res.json({ stories: listStories().map(toPublicStory) });
}

export function postStory(req, res) {
  const { title, content } = req.body ?? {};
  if (!isText(title) || !isText(content)) {
    return res.status(400).json({ error: "A story needs a title and some content" });
  }
  const story = createStory({
    title: title.trim(),
    content: content.trim(),
    authorId: req.user.id,
  });
  res.status(201).json({ story: toPublicStory(story) });
}

export function patchStory(req, res) {
  if (!canEdit(req.story, req.user.id)) {
    return res.status(403).json({ error: "Only the author and contributors can edit this story" });
  }
  const { title, content } = req.body ?? {};
  const changes = {};
  if (isText(title)) changes.title = title.trim();
  if (isText(content)) changes.content = content.trim();
  if (Object.keys(changes).length === 0) {
    return res.status(400).json({ error: "Send a new title or content" });
  }
  res.json({ story: toPublicStory(updateStory(req.story, changes)) });
}

export function removeStory(req, res) {
  if (req.story.authorId !== req.user.id) {
    return res.status(403).json({ error: "Only the author can delete this story" });
  }
  deleteStory(req.story.id);
  res.status(204).end();
}

export function addContributor(req, res) {
  if (req.story.authorId !== req.user.id) {
    return res.status(403).json({ error: "Only the author can add contributors" });
  }
  const { username } = req.body ?? {};
  const user = isText(username) ? findUserByUsername(username) : undefined;
  if (!user) return res.status(404).json({ error: "No user with that name" });
  if (user.id === req.story.authorId || req.story.contributorIds.includes(user.id)) {
    return res.status(409).json({ error: "That user can already edit this story" });
  }
  req.story.contributorIds.push(user.id);
  res.status(201).json({ story: toPublicStory(req.story) });
}
