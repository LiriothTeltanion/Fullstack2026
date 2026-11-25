// Exercises XP Gold: promises, timers and async/await
// Run with: node asyncGold.js

// Exercise 1: a promise-based sleep()
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// A fake "download" that takes `ms` milliseconds
const download = (name, ms) => sleep(ms).then(() => `${name} (${ms} ms)`);

// Small helper to time any async function
async function timed(label, task) {
  const start = Date.now();
  const result = await task();
  const seconds = (Date.now() - start) / 1000;
  console.log(`${label} took about ${seconds.toFixed(1)} s ->`, result);
}

// Exercise 5 needs a function that fails the first two times it is called
let attempts = 0;
function flakyRequest() {
  attempts++;
  return attempts < 3
    ? Promise.reject(new Error(`attempt ${attempts} failed`))
    : Promise.resolve(`ok on attempt ${attempts}`);
}

// Exercise 3: reject if a promise is slower than `ms`
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`timed out after ${ms} ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Exercise 5: try again with a longer wait each time
async function retry(task, tries = 4, waitMs = 100) {
  for (let i = 1; i <= tries; i++) {
    try {
      return await task();
    } catch (error) {
      console.log(`   ${error.message}, waiting ${waitMs} ms`);
      if (i === tries) throw error;
      await sleep(waitMs);
      waitMs *= 2;
    }
  }
}

async function main() {
  // Exercise 2: one after another vs all at the same time
  await timed("2. Sequential", async () => {
    const a = await download("a", 500);
    const b = await download("b", 500);
    return [a, b];
  });
  await timed("   Parallel", () => Promise.all([download("a", 500), download("b", 500)]));

  // Exercise 3
  console.log("3.", await withTimeout(download("fast", 100), 300));
  try {
    await withTimeout(download("slow", 800), 300);
  } catch (error) {
    console.log("  ", error.message);
  }

  // Exercise 4: allSettled() reports every result, even the failures
  const results = await Promise.allSettled([
    download("one", 50),
    Promise.reject(new Error("server error")),
    download("three", 80),
  ]);
  console.log("4.");
  results.forEach(({ status, value, reason }) =>
    console.log(`   ${status}: ${value ?? reason.message}`)
  );

  // Exercise 5
  console.log("5.");
  console.log("  ", await retry(flakyRequest));
}

main();
