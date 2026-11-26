import { fileInfo } from "./file-info.js";
import { datePair, digitsIn, isPracticeFullName, postTitles, sampleUsers } from "./practice.js";

const [command, ...args] = process.argv.slice(2);
const text = args.join(" ");
try {
  switch (command) {
    case "file":
      console.log(JSON.stringify(await fileInfo(text || "README.md"), null, 2));
      break;
    case "posts":
      for (const title of await postTitles()) console.log(title);
      break;
    case "dates": {
      const { today, inFiveDays } = datePair();
      console.log(`Today: ${today}\nFive days later: ${inFiveDays}`);
      break;
    }
    case "users":
      console.log(JSON.stringify(sampleUsers(args.length ? Number(text) : 3), null, 2));
      break;
    case "digits":
      console.log(digitsIn(text));
      break;
    case "name":
      console.log(isPracticeFullName(text) ? "Valid practice name" : "Invalid practice name");
      break;
    default:
      console.error("Usage: node examples.js <file|posts|dates|users|digits|name> [value]");
      process.exitCode = 1;
  }
} catch (error) {
  console.error(`Could not run ${command}: ${error.message}`);
  process.exitCode = 1;
}
