import { users } from "../data/users.js";

export function loadUser(req, res, next, id) {
  const user = users.find(u => u.id === Number(id));
  if (!user) {
    return res.status(404).json({ error: `User ${id} not found` });
  }
  req.user = user;
  next();
}

export function listUsers(req, res) {
  const { city } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 3);

  const filtered = city ? users.filter(u => u.city.toLowerCase() === city.toLowerCase()) : users;

  const start = (page - 1) * limit;
  res.json({
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
    data: filtered.slice(start, start + limit),
  });
}

export function getUser(req, res) {
  res.json(req.user); // already loaded by router.param
}
