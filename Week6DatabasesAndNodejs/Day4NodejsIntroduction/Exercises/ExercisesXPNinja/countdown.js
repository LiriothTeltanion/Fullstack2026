// Exercise 4: a countdown with setInterval and clearInterval
// Usage: node countdown.js 5
const seconds = Number.parseInt(process.argv[2] ?? "3", 10);

if (Number.isNaN(seconds) || seconds < 1) {
  console.log("Give a whole number of seconds, for example: node countdown.js 5");
  process.exit(1);
}

let left = seconds;
console.log(`Counting down from ${left}...`);

const timer = setInterval(() => {
  left--;
  if (left > 0) {
    console.log(left);
  } else {
    clearInterval(timer); // without this the interval would run forever
    console.log("Time is up");
  }
}, 1000);

// Ctrl+C stops the countdown early with a message instead of a plain exit
process.on("SIGINT", () => {
  clearInterval(timer);
  console.log(`\nStopped with ${left} seconds left`);
  process.exit(0);
});
