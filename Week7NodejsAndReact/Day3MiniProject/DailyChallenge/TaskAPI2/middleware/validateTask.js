const PRIORITIES = ["low", "medium", "high"];

// partial = true for PUT, where every field is optional.
export default function validateTask(partial = false) {
  return (req, res, next) => {
    const { title, priority, dueDate, completed } = req.body;
    const errors = [];

    if (!partial || title !== undefined) {
      if (typeof title !== "string" || title.trim().length < 3)
        errors.push("title needs at least 3 characters");
    }
    if (priority !== undefined && !PRIORITIES.includes(priority)) {
      errors.push(`priority must be one of: ${PRIORITIES.join(", ")}`);
    }
    if (dueDate !== undefined && dueDate !== null && Number.isNaN(Date.parse(dueDate))) {
      errors.push("dueDate must be a date like 2026-12-01");
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      errors.push("completed must be true or false");
    }

    if (errors.length > 0) return res.status(400).json({ errors });
    next();
  };
}
