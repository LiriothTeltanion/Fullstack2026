import { tips } from "../data/tips.js";

// GET /api/tips
export function getAllTips(req, res) {
  res.json(tips);
}

// GET /api/tips/random
export function getRandomTip(req, res) {
  const index = Math.floor(Math.random() * tips.length);
  res.json(tips[index]);
}

// GET /api/tips/:id
export function getTipById(req, res) {
  const tip = tips.find(t => t.id === Number(req.params.id));
  if (!tip) {
    return res.status(404).json({ error: "Tip not found." });
  }
  res.json(tip);
}
