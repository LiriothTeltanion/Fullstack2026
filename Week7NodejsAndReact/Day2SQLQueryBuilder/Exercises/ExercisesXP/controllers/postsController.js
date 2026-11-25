import * as Posts from "../models/postsModel.js";

const isText = value => typeof value === "string" && value.trim() !== "";

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
  const { title, content } = req.body ?? {};
  if (!isText(title) || !isText(content) || title.trim().length > 200) {
    return res.status(400).json({ error: "title and content are required" });
  }
  try {
    res.status(201).json(await Posts.createPost({ title: title.trim(), content: content.trim() }));
  } catch (err) {
    next(err);
  }
}

export async function editPost(req, res, next) {
  const { title, content } = req.body ?? {};
  if (!isText(title) || !isText(content) || title.trim().length > 200) {
    return res.status(400).json({ error: "title and content are required" });
  }
  try {
    const post = await Posts.updatePost(req.params.id, {
      title: title.trim(),
      content: content.trim(),
    });
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
