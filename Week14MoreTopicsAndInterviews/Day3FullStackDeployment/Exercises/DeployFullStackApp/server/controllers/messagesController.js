import { addMessage, deleteMessage, getLatestMessages } from "../models/messageModel.js";

// GET /api/messages
export async function listMessages(req, res) {
  res.json(await getLatestMessages());
}

// POST /api/messages  { name, text }
export async function createMessage(req, res) {
  const name = String(req.body?.name ?? "").trim();
  const text = String(req.body?.text ?? "").trim();

  if (!name || !text) {
    return res.status(400).json({ error: "Name and message are both required." });
  }
  if (name.length > 40 || text.length > 280) {
    return res.status(400).json({ error: "Names are up to 40 characters, messages up to 280." });
  }

  res.status(201).json(await addMessage({ name, text }));
}

// DELETE /api/messages/:id
export async function removeMessage(req, res) {
  const deleted = await deleteMessage(Number(req.params.id));
  if (deleted === 0) {
    return res.status(404).json({ error: "Message not found." });
  }
  res.status(204).end();
}
