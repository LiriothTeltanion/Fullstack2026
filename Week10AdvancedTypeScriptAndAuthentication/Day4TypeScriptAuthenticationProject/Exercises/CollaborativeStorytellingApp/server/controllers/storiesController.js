import {
  canEdit,
  inviteContributor,
  createStory,
  deleteStory,
  listStories,
  toPublicStory,
  updateStory,
} from "../models/storyModel.js";
import { findUserByUsername, findUserById } from "../models/userModel.js";

const isText = value => typeof value === "string" && value.trim() !== "";

export async function getStories(req, res) {
  res.json({ stories: await Promise.all((await listStories()).map(toPublicStory)) });
}

export async function postStory(req, res) {
  const { title, content } = req.body ?? {};
  if (!isText(title) || !isText(content)) {
    return res.status(400).json({ error: "A story needs a title and some content" });
  }
  const story = await createStory({
    title: title.trim(),
    content: content.trim(),
    authorId: req.user.id,
  });
  res.status(201).json({ story: await toPublicStory(story) });
}

export async function patchStory(req, res) {
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
  res.json({ story: await toPublicStory(await updateStory(req.story, changes)) });
}

export async function removeStory(req, res) {
  if (req.story.authorId !== req.user.id) {
    return res.status(403).json({ error: "Only the author can delete this story" });
  }
  await deleteStory(req.story.id);
  res.status(204).end();
}

export async function addContributor(req, res) {
  if (req.story.authorId !== req.user.id) {
    return res.status(403).json({ error: "Only the author can add contributors" });
  }
  const { username } = req.body ?? {};
  const user = isText(username)
    ? await findUserByUsername(username)
    : await findUserById(Number(req.body?.user_id));
  if (!user) return res.status(404).json({ error: "No user with that name" });
  if (user.id === req.story.authorId || req.story.contributorIds.includes(user.id)) {
    return res.status(409).json({ error: "That user can already edit this story" });
  }
  const updated = await inviteContributor(req.story, user.id);
  res.status(201).json({ story: await toPublicStory(updated) });
}
