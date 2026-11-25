// Stops the request with 400 when the body is not a valid post.
export default function validatePost(req, res, next) {
  const { title, content } = req.body;
  const errors = [];
  if (typeof title !== "string" || title.trim().length < 3) {
    errors.push("title must have at least 3 characters");
  }
  if (typeof content !== "string" || content.trim() === "") {
    errors.push("content is required");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}
