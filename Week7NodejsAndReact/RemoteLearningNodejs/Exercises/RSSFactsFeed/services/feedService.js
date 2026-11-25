// Downloads the feed with rss-parser and keeps it for 10 minutes,
// so every search does not hit the other website again.
import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();
const FEED_URL = process.env.FEED_URL || "https://thefactfile.org/feed/";
const TEN_MINUTES = 10 * 60 * 1000;
let cache = { posts: null, savedAt: 0 };

export async function getPosts() {
  if (cache.posts && Date.now() - cache.savedAt < TEN_MINUTES) return cache.posts;

  const response = await axios.get(FEED_URL, {
    responseType: "text",
    timeout: 10000,
    maxContentLength: 3 * 1024 * 1024,
  });
  const feed = await parser.parseString(response.data);
  const posts = feed.items.map(item => ({
    title: item.title || "Untitled post",
    creator: item.creator || item.author || "",
    link: /^https?:\/\//i.test(item.link || "") ? item.link : null,
    date: item.pubDate ? new Date(item.pubDate).toDateString() : "",
    summary: item["content:encodedSnippet"] || item.contentSnippet || "",
    categories: item.categories ?? [],
  }));
  cache = { posts, savedAt: Date.now() };
  return posts;
}

export async function getCategories() {
  const posts = await getPosts();
  return [...new Set(posts.flatMap(p => p.categories))].sort();
}
