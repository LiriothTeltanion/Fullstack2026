const posts = [
  { id: 1, title: "Middleware order", content: "app.use runs top to bottom." },
  { id: 2, title: "next()", content: "Forget it and the request hangs." },
];
// Seeded and newly submitted posts expose the same creation-time contract.
for (const post of posts) post.timestamp = new Date().toISOString();
let nextId = 3;

function findIndex(id) {
  return posts.findIndex(post => post.id === Number(id));
}

export function getPosts(req, res) {
  res.json(posts);
}

export function getPost(req, res, next) {
  const index = findIndex(req.params.id);
  if (index === -1) {
    // Passing an error to next() sends it to the error handler.
    const error = new Error("Post not found");
    error.status = 404;
    return next(error);
  }
  res.json(posts[index]);
}

export function createPost(req, res) {
  const post = { id: nextId++, title: req.body.title.trim(), content: req.body.content.trim() };
  post.timestamp = new Date().toISOString();
  posts.push(post);
  res.status(201).json(post);
}

export function updatePost(req, res) {
  const index = findIndex(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  posts[index] = {
    ...posts[index],
    title: req.body.title.trim(),
    content: req.body.content.trim(),
  };
  res.json(posts[index]);
}

export function deletePost(req, res) {
  const index = findIndex(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  posts.splice(index, 1);
  res.json({ message: "Post deleted" });
}
