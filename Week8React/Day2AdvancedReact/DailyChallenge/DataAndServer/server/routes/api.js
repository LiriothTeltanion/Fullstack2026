import { Router } from "express";

const router = Router();

// Part 1: the client reads this message when it loads.
router.get("/hello", (req, res) => {
  res.json({ message: "Hello From Express" });
});

// Part 2: echo back what the client posted.
router.post("/world", (req, res) => {
  const { post } = req.body;
  if (!post || !post.trim()) {
    return res.status(400).json({ error: "Please type something first." });
  }
  console.log("Received:", post);
  res.json({
    message: `I received your POST request. This is what you sent me: ${post}`,
  });
});

export default router;
