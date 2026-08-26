// Module: app
// Purpose: Show a colorful terminal message with chalk (CommonJS, v4).
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-19 | TZ: Asia/Jerusalem
// Notes: Install deps first: `npm install`. Then: `node app.js`.

const chalk = require("chalk");

console.log(
  chalk.bold("Welcome to the ") + chalk.bgBlue.white(" NPM Beginner ") + chalk.bold(" demo!")
);

console.log(chalk.green("✅ Success: ") + chalk.reset("You just printed a colorful message."));

console.log(
  chalk.yellow("💡 Tip: ") +
    chalk.reset("Try different chalk styles like ") +
    chalk.underline("underline") +
    chalk.reset(", ") +
    chalk.italic("italic") +
    chalk.reset(", or ") +
    chalk.inverse("inverse") +
    chalk.reset(".")
);
