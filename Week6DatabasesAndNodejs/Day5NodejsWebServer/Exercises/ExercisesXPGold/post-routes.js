import { Router } from "express";
import axios from "axios";

const samplePosts = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000,
});

export function postRoutes(upstream = samplePosts) {
  const router = Router();
  router.param("id", (req, res, next, id) => {
    if (!/^[1-9]\d*$/.test(id)) return res.status(400).json({ error: "Use a positive post ID." });
    next();
  });

  async function forward(method, req, res) {
    const endpoint = req.params.id ? `/posts/${req.params.id}` : "/posts";
    let data;
    if (method === "post" || method === "put") {
      const { title, body, userId } = req.body ?? {};
      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof body !== "string" ||
        !body.trim() ||
        !Number.isSafeInteger(userId) ||
        userId < 1
      ) {
        return res
          .status(400)
          .json({ error: "Provide a title, body and positive integer userId." });
      }
      data = { title: title.trim(), body: body.trim(), userId };
    }
    try {
      const reply = await upstream.request({ method, url: endpoint, data });
      if (method === "delete") return res.sendStatus(204);
      return res.status(method === "post" ? 201 : 200).json(reply.data);
    } catch (error) {
      if (error.response?.status === 404) return res.status(404).json({ error: "Post not found." });
      return res.status(502).json({ error: "The sample post service is currently unavailable." });
    }
  }
  router.get("/", (req, res) => forward("get", req, res));
  router.get("/:id", (req, res) => forward("get", req, res));
  router.post("/", (req, res) => forward("post", req, res));
  router.put("/:id", (req, res) => forward("put", req, res));
  router.delete("/:id", (req, res) => forward("delete", req, res));
  return router;
}
