import {
  createComment,
  listComments,
  findComment,
  updateComment,
  deleteComment,
  commentCapabilities,
} from "../models/commentModel.js";

export function normalizeCommentBody(value) {
  if (typeof value !== "string") return undefined;
  const body = value.trim();
  // PostgreSQL char_length counts Unicode code points, not UTF-16 code units.
  const length = Array.from(body).length;
  if (length < 1 || length > 2000 || body.includes("\0")) return undefined;
  return body;
}

export async function getComments(req, res) {
  res.json({ comments: await listComments(req.story.id) });
}

export async function postComment(req, res) {
  const body = normalizeCommentBody(req.body?.body);
  if (body === undefined) {
    return res.status(400).json({ error: "A comment needs between 1 and 2000 characters" });
  }
  // Identity always comes from the authenticated request, never from JSON fields.
  const comment = await createComment({ storyId: req.story.id, authorId: req.user.id, body });
  if (!comment) return res.status(404).json({ error: "Story not found" });
  res.status(201).json({ comment });
}

export async function patchComment(req, res) {
  const commentId = Number(req.params.commentId);
  const comment = await findComment(req.story.id, commentId);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  if (comment.author.id !== req.user.id) {
    return res.status(403).json({ error: "Only the comment author can edit it" });
  }
  const body = normalizeCommentBody(req.body?.body);
  if (body === undefined) {
    return res.status(400).json({ error: "A comment needs between 1 and 2000 characters" });
  }
  if (!(await commentCapabilities()).edit) return unavailable(res);
  let updated;
  try {
    updated = await updateComment({
      storyId: req.story.id,
      commentId,
      userId: req.user.id,
      body,
    });
  } catch (error) {
    if (error.code === "42501") return unavailable(res);
    throw error;
  }
  if (!updated) return res.status(404).json({ error: "Comment no longer exists" });
  res.json({ comment: updated });
}

export async function removeComment(req, res) {
  const commentId = Number(req.params.commentId);
  const comment = await findComment(req.story.id, commentId);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  if (comment.author.id !== req.user.id && req.story.authorId !== req.user.id) {
    return res.status(403).json({ error: "Only the comment or story author can delete it" });
  }
  if (!(await commentCapabilities()).delete) return unavailable(res);
  let removed;
  try {
    removed = await deleteComment({ storyId: req.story.id, commentId, userId: req.user.id });
  } catch (error) {
    if (error.code === "42501") return unavailable(res);
    throw error;
  }
  if (!removed) return res.status(404).json({ error: "Comment no longer exists" });
  res.sendStatus(204);
}

export async function getCommentCapabilities(req, res) {
  res.set("Cache-Control", "no-store").json(await commentCapabilities());
}

function unavailable(res) {
  return res.status(503).json({
    error: "This comment action is currently unavailable. You can still read and add comments.",
  });
}
