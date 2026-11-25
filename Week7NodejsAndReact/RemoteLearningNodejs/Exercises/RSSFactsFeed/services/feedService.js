// Downloads the feed with rss-parser and keeps it for 10 minutes,
// so every search does not hit the other website again.
import Parser from "rss-parser";

const parser = new Parser();
const FEED_URL = process.env.FEED_URL || "https://thefactfile.org/feed/";
const TEN_MINUTES = 10 * 60 * 1000;
let cache = { posts: null, savedAt: 0 };

export async function getPosts() {
  if (cache.posts && Date.now() - cache.savedAt < TEN_MINUTES) return cache.posts;

  const feed = await parser.parseURL(FEED_URL);
  const posts = feed.items.map(item => ({
    title: item.title,
    link: item.link,
    date: item.pubDate ? new Date(item.pubDate).toDateString() : "",
    summary: item.contentSnippet?.slice(0, 220) ?? "",
    categories: item.categories ?? [],
  }));
  cache = { posts, savedAt: Date.now() };
  return posts;
}

export async function getCategories() {
  const posts = await getPosts();
  return [...new Set(posts.flatMap(p => p.categories))].sort();
}
