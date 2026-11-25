// Dependency injection keeps this HTTP handler testable without a live database.
export function createAddItemHandler(createItem) {
  return async function addItem(req, res, next) {
    const body = req.body;
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      typeof body.title !== "string"
    ) {
      return res.status(400).json({ error: "Title is required and must be a string." });
    }

    const title = body.title.trim();
    // PostgreSQL char_length counts Unicode code points, not UTF-16 code units.
    // Validate before calling the model: rejected titles must not consume IDs.
    if (!title || Array.from(title).length > 120) {
      return res.status(400).json({ error: "Title must contain between 1 and 120 characters." });
    }

    try {
      res.status(201).json(await createItem(title));
    } catch (error) {
      next(error);
    }
  };
}
