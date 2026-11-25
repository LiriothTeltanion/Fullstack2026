// Exercises XP Gold: fetch() with async/await
// Uses JSONPlaceholder, a free fake REST API that needs no key.
// Run with: node fetchGold.js (Node 18+ has fetch built in)

const BASE_URL = "https://jsonplaceholder.typicode.com";

// One helper for every request: checks response.ok and parses the JSON
async function getJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    // statusText is often empty over HTTP/2, so only the number is used
    throw new Error(`HTTP ${response.status} for ${path}`);
  }
  return response.json();
}

// Exercise 1: list the users' names
async function showUsers() {
  const users = await getJson("/users");
  console.log(`1. ${users.length} users:`, users.map(user => user.name).join(", "));
}

// Exercise 2: how many posts each of the first three users wrote
async function countPosts() {
  console.log("2. Posts per user:");
  for (const userId of [1, 2, 3]) {
    const posts = await getJson(`/posts?userId=${userId}`);
    console.log(`   user ${userId}: ${posts.length} posts, first title "${posts[0].title}"`);
  }
}

// Exercise 3: a missing resource answers 404, and fetch() does NOT throw for that
async function handleNotFound() {
  try {
    await getJson("/posts/9999");
  } catch (error) {
    console.log("3. Caught:", error.message);
  }
}

// Exercise 4: three requests at the same time with Promise.all()
async function parallelTodos() {
  const todos = await Promise.all([1, 2, 3].map(id => getJson(`/todos/${id}`)));
  console.log("4. Todos:");
  todos.forEach(todo => console.log(`   [${todo.completed ? "x" : " "}] ${todo.title}`));
}

// Exercise 5: POST a new post (JSONPlaceholder fakes the save and returns id 101)
async function createPost() {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "My first POST", body: "Sent with fetch()", userId: 1 }),
  });
  const created = await response.json();
  console.log(`5. POST answered ${response.status}:`, created);
}

async function main() {
  try {
    await showUsers();
    await countPosts();
    await handleNotFound();
    await parallelTodos();
    await createPost();
  } catch (error) {
    console.error("Something went wrong (are you online?):", error.message);
  }
}

main();
