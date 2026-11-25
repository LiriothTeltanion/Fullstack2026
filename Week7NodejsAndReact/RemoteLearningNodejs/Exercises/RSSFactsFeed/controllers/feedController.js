import { getPosts, getCategories } from "../services/feedService.js";

export async function showAll(req, res, next) {
  try {
    res.render("pages/index", { title: "Latest facts", posts: await getPosts() });
  } catch (err) {
    next(err);
  }
}

export async function showSearch(req, res, next) {
  try {
    res.render("pages/search", { categories: await getCategories(), posts: null, query: "" });
  } catch (err) {
    next(err);
  }
}

export async function searchByTitle(req, res, next) {
  try {
    const query = (req.body.title || "").trim();
    const posts = (await getPosts()).filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    res.render("pages/search", { categories: await getCategories(), posts, query });
  } catch (err) {
    next(err);
  }
}

export async function searchByCategory(req, res, next) {
  try {
    const query = req.body.category || "";
    const posts = (await getPosts()).filter(p => p.categories.includes(query));
    res.render("pages/search", { categories: await getCategories(), posts, query });
  } catch (err) {
    next(err);
  }
}
