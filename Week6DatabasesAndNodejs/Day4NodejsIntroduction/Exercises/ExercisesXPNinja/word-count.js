// Exercise 1: count lines, words and the most used words of a text file
// Usage: node word-count.js sample.txt
import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

const file = process.argv[2] ?? "sample.txt";
const IGNORE = new Set(["the", "a", "of", "so", "in", "i", "it", "and", "to", "is"]);

async function countWords(filePath) {
  const lines = createInterface({ input: createReadStream(filePath), crlfDelay: Infinity });
  const counts = new Map();
  let lineCount = 0;
  let wordCount = 0;

  // for await reads the stream one line at a time
  for await (const line of lines) {
    lineCount++;
    const words = line.toLowerCase().match(/[a-z']+/g) ?? [];
    wordCount += words.length;
    for (const word of words) {
      if (!IGNORE.has(word)) counts.set(word, (counts.get(word) ?? 0) + 1);
    }
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { lineCount, wordCount, top: top.slice(0, 5) };
}

try {
  const { lineCount, wordCount, top } = await countWords(file);
  console.log(`${file}: ${lineCount} lines, ${wordCount} words`);
  console.log("Most used words:");
  top.forEach(([word, count]) => console.log(`  ${word.padEnd(8)} ${count}`));
} catch (error) {
  console.error(`Cannot read ${file}: ${error.code}`);
  process.exitCode = 1;
}
