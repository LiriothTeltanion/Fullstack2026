import { readNotes, saveNotes } from "../models/notesModel.js";

function checkNote({ title, body }) {
  if (typeof title !== "string" || title.trim() === "") return "title is required";
  if (typeof body !== "string") return "body must be text";
  return null;
}

export async function listNotes(req, res, next) {
  try {
    const q = (req.query.q || "").toLowerCase();
    const notes = (await readNotes())
      .filter(n => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)); // newest first
    res.json(notes);
  } catch (err) {
    next(err);
  }
}

export async function createNote(req, res, next) {
  const error = checkNote(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const notes = await readNotes();
    const note = {
      id: notes.length ? Math.max(...notes.map(n => n.id)) + 1 : 1,
      title: req.body.title.trim(),
      body: req.body.body.trim(),
      updatedAt: new Date().toISOString(),
    };
    notes.push(note);
    await saveNotes(notes);
    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
}

export async function updateNote(req, res, next) {
  const error = checkNote(req.body);
  if (error) return res.status(400).json({ error });
  try {
    const notes = await readNotes();
    const note = notes.find(n => n.id === Number(req.params.id));
    if (!note) return res.status(404).json({ error: "Note not found" });
    note.title = req.body.title.trim();
    note.body = req.body.body.trim();
    note.updatedAt = new Date().toISOString();
    await saveNotes(notes);
    res.json(note);
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const notes = await readNotes();
    const remaining = notes.filter(n => n.id !== Number(req.params.id));
    if (remaining.length === notes.length) return res.status(404).json({ error: "Note not found" });
    await saveNotes(remaining);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
