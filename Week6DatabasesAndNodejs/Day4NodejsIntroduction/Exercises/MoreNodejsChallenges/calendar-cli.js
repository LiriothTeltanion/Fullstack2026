import { createInterface } from "node:readline";
import { minutesLived, nextHoliday, timeUntilNewYear } from "./calendar.js";

function duration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds % 60}s`;
}

async function askBirthDate() {
  const lines = createInterface({ input: process.stdin });
  try {
    process.stdout.write("Enter a birth date (YYYY-MM-DD): ");
    for await (const line of lines) return line.trim();
    throw new Error("No birth date was provided.");
  } finally {
    lines.close();
  }
}

async function main(args) {
  const usage = "Usage: node calendar-cli.js [YYYY-MM-DD | --ask | --help]";
  if (args.length > 1) throw new Error(usage);
  if (args[0] === "--help") {
    console.log(usage);
    return;
  }

  const birthDate = args[0] === "--ask" ? await askBirthDate() : args[0];
  const now = new Date();
  const lived = birthDate === undefined ? undefined : minutesLived(birthDate, now);
  const holiday = nextHoliday(now);
  const local = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Jerusalem",
  });
  console.log(`Now in Jerusalem: ${local.format(now)}`);
  console.log(`Until 1 January at 00:00 UTC: ${duration(timeUntilNewYear(now))}`);
  if (lived !== undefined) console.log(`Minutes lived since midnight UTC: ${lived}`);
  const timing = holiday.underway ? "underway" : `in ${duration(holiday.remainingMs)}`;
  console.log(
    `Public holiday: ${holiday.name} (${timing}, starts ${local.format(holiday.start)} in Jerusalem)`
  );
}

try {
  await main(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
