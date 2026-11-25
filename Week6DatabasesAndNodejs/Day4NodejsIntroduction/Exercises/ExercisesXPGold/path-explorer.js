// Exercise 2: take a file path apart and build new ones with the path module
import path from "node:path";
import { fileURLToPath } from "node:url";

// ES modules have no __dirname, so I build it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const example = "projects/music/mixes/final-master.wav";
const parts = path.parse(example);

console.log("This script: ", path.basename(__filename));
console.log("Its folder:  ", path.basename(__dirname));
console.log("parse():     ", parts);
console.log("extname():   ", path.extname(example));
console.log("join():      ", path.posix.join("projects", "music", "..", "code", "app.js"));
console.log("New name:    ", path.posix.format({ dir: parts.dir, name: parts.name, ext: ".mp3" }));
console.log("isAbsolute():", path.isAbsolute(example), path.isAbsolute(__dirname));
