// Supply two jobs so the timing examples can also be exercised without real timers.
export async function sequentialJobs(startSlow, startFast, announce) {
  announce(await startSlow());
  announce(await startFast());
}

export async function concurrentJobs(startSlow, startFast, announce) {
  const slow = startSlow();
  const fast = startFast();
  // Attach rejection handlers immediately, even though we report slow before fast.
  const results = await Promise.all([slow, fast]);
  for (const value of results) announce(value);
}

export async function fetchCollections(urls, request = fetch, report = console.log) {
  try {
    const lists = await Promise.all(
      urls.map(async url => {
        const response = await request(url);
        if (!response.ok) throw new Error("HTTP " + response.status);
        return await response.json();
      })
    );
    return lists;
  } catch (error) {
    report("ooooooops", error.message);
    return undefined;
  }
}

if (import.meta.main) {
  const start = (name, delay) => () => {
    console.log("starting", name);
    return new Promise(resolve =>
      setTimeout(() => {
        console.log("completed", name);
        resolve(name);
      }, delay)
    );
  };
  const slow = start("slow", 2000);
  const fast = start("fast", 1000);
  await sequentialJobs(slow, fast, console.log);
  await concurrentJobs(slow, fast, console.log);
  const root = "https://jsonplaceholder.typicode.com/";
  const lists = await fetchCollections(["users", "posts", "albums"].map(p => root + p));
  if (lists) console.log(lists.map(records => records.length));
}
