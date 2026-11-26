import { Command } from "commander";
import chalk from "chalk";
import { greeting } from "./greet.js";
import { fetchPost } from "./fetch-post.js";
import { readText } from "./read-text.js";
import { weatherDashboard } from "./weather-dashboard.js";

const program = new Command()
  .name("stage-tools")
  .description("Greeting, post, file and weather practice");
program
  .command("greet <name...>")
  .description("Greet a listener")
  .action(words => console.log(chalk.green(greeting(words.join(" ")))));
program
  .command("fetch [id]")
  .description("Read a sample post from JSONPlaceholder")
  .action(async (id = "1") => {
    const post = await fetchPost(id);
    console.log(chalk.bold(post.title));
    console.log(post.body);
  });
program
  .command("read <file>")
  .description("Print a local UTF-8 text file")
  .action(async filename => {
    process.stdout.write(await readText(filename));
  });
program
  .command("weather [city...]")
  .description("Look up current weather, or prompt for a city")
  .action(async words => {
    await weatherDashboard(words?.length ? words.join(" ") : undefined);
  });

try {
  await program.parseAsync();
} catch (error) {
  console.error(chalk.red(`Could not complete command: ${error.message}`));
  process.exitCode = 1;
}
