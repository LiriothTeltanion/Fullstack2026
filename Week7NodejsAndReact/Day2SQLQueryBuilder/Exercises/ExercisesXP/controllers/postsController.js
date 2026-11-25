import * as Posts from "../models/postsModel.js";

export async function listPosts(req, res, next) {
  try {
    res.json(await Posts.getAllPosts());
  } catch (err) {
    next(err);
  }
}

export async function showPost(req, res, next) {
  try {
    const post = await Posts.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function addPost(req, res, next) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }
  try {
    res.status(201).json(await Posts.createPost({ title, content }));
  } catch (err) {
    next(err);
  }
}

export async function editPost(req, res, next) {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }
  try {
    const post = await Posts.updatePost(req.params.id, { title, content });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function removePost(req, res, next) {
  try {
    const deleted = await Posts.deletePost(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}
