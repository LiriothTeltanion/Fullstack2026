import { createComment, listComments } from "../models/commentModel.js";

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
