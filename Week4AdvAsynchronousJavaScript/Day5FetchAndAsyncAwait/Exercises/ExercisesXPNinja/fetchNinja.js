// Exercises XP Ninja: pagination, timeouts, a cache and a concurrency limit
// Uses JSONPlaceholder (no key needed). Run with: node fetchNinja.js

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Exercise 1: abort a request that takes too long with AbortSignal.timeout()
async function fetchJson(url, timeoutMs = 5000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

// Exercise 2: an async generator that yields one page at a time until a page is empty
async function* pages(path, limit) {
  for (let page = 1; ; page++) {
    const items = await fetchJson(`${BASE_URL}${path}?_page=${page}&_limit=${limit}`);
    if (items.length === 0) return;
    yield items;
  }
}

// Exercise 3: a small cache so the same URL is only fetched once
const cache = new Map();
function cachedFetch(url) {
  if (!cache.has(url)) {
    // Store the promise itself, so two calls at the same time share one request
    cache.set(url, fetchJson(url));
  }
  return cache.get(url);
}

// Exercise 4: run many async tasks, but never more than `limit` at the same time
async function mapWithLimit(items, limit, task) {
  const results = new Array(items.length);
  let next = 0;
  let running = 0;
  let maxRunning = 0;

  async function worker() {
    while (next < items.length) {
      const index = next++;
      running++;
      maxRunning = Math.max(maxRunning, running);
      results[index] = await task(items[index]);
      running--;
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return { results, maxRunning };
}

async function main() {
  // 1. A timeout that is far too short, on purpose
  try {
    await fetchJson(`${BASE_URL}/photos`, 1);
  } catch (error) {
    console.log("1. Timeout:", error.name);
  }

  // 2. Read every comment of post 1, two per page, with for await...of
  let total = 0;
  let pageCount = 0;
  for await (const page of pages("/posts/1/comments", 2)) {
    pageCount++;
    total += page.length;
  }
  console.log(`2. ${total} comments in ${pageCount} pages`);

  // 3. Ask for the same user three times
  const [a, b, c] = await Promise.all([1, 1, 1].map(() => cachedFetch(`${BASE_URL}/users/1`)));
  console.log(
    `3. ${a.name} three times, same object: ${a === b && b === c}, cache size ${cache.size}`
  );

  // 4. Ten albums, at most three requests at a time
  const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  const { results, maxRunning } = await mapWithLimit(ids, 3, id =>
    fetchJson(`${BASE_URL}/albums/${id}`)
  );
  console.log(`4. Got ${results.length} albums, never more than ${maxRunning} at once`);
  console.log(`   First album: "${results[0].title}"`);
}

main().catch(error => console.error("Failed:", error.message));
