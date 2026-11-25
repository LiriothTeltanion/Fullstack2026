// Start both jobs together and hold all output until their results are available.
export async function reportInInputOrder(jobs, announce) {
  const results = await Promise.all(jobs.map(start => start()));
  for (const value of results) announce(value);
}

// Here each job reports immediately after it resolves, so the fast one reports first.
export async function reportAsReady(jobs, announce) {
  await Promise.all(jobs.map(async start => announce(await start())));
}

// .then() also attaches an independent handler per job. Returning the aggregate lets our caller handle a rejection.
export function reportWithThen(jobs, announce) {
  return Promise.all(jobs.map(start => start().then(announce)));
}

if (import.meta.main) {
  const delayed = (name, delay) => () =>
    new Promise(resolve => {
      console.log("starting", name);
      setTimeout(() => {
        console.log("completed", name);
        resolve(name);
      }, delay);
    });
  const jobs = [delayed("slow", 2000), delayed("fast", 1000)];
  for (const demo of [reportInInputOrder, reportAsReady, reportWithThen]) {
    console.log(demo.name);
    await demo(jobs, value => console.log(value));
  }
}
