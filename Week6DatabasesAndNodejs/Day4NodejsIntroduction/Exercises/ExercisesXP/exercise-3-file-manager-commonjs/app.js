// Module: app
// Purpose: Demo readFile + writeFile by copying text across two files.
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-19 | TZ: Asia/Jerusalem
// Notes: Read 'Hello World.txt', then write to 'output/Bye World.txt'. ✅
//        output/ is git-ignored, so running the demo leaves the tracked files alone.

const { readFile, writeFile } = require("./fileManager");

async function main() {
  const hello = await readFile("./Hello World.txt");
  console.log(`💡 Content of 'Hello World.txt': ${hello.trim()}`);
  await writeFile("./output/Bye World.txt", "Writing to the file");
  console.log("⚙️  Done.");
}

main().catch(() => process.exit(1));
