// Exercise 4: save and load JSON with fs/promises
// The file goes in the system temp folder, so running this never adds files to the repo.
import { readFile, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const FILE = path.join(os.tmpdir(), "day4-gold-visits.json");

async function loadVisits() {
  try {
    return JSON.parse(await readFile(FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return { count: 0, history: [] }; // first run
    throw error;
  }
}

async function saveVisits(data) {
  await writeFile(FILE, JSON.stringify(data, null, 2));
}

async function main() {
  await rm(FILE, { force: true }); // start clean for the demo

  for (let i = 0; i < 3; i++) {
    const visits = await loadVisits();
    visits.count++;
    visits.history.push(`visit ${visits.count}`);
    await saveVisits(visits);
    console.log(`Saved visit ${visits.count}`);
  }

  const final = await loadVisits();
  console.log("Read back from disk:", final);
  await rm(FILE);
  console.log("Removed", path.basename(FILE));
}

main().catch(error => console.error("Could not use the file:", error.message));
