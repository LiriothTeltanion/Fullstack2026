import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { addNote, DEFAULT_NOTES_FILE, listNotes, readNote, removeNote } from "./notes.js";

const titleOption = parser =>
  parser.option("title", {
    type: "string",
    demandOption: true,
    description: "The note's title (case-sensitive)",
  });

try {
  yargs(hideBin(process.argv))
    .scriptName("node app")
    .locale("en")
    .usage("$0 <command> [options]")
    .option("file", {
      type: "string",
      default: DEFAULT_NOTES_FILE,
      description: "A separate JSON notes file",
    })
    .command(
      "add",
      "Add one note",
      parser =>
        titleOption(parser).option("body", {
          type: "string",
          demandOption: true,
          description: "The note's text",
        }),
      args => {
        const note = addNote(args.title, args.body, args.file);
        console.log("Note added: " + note.title);
      }
    )
    .command(
      "list",
      "Display all note titles",
      () => {},
      args => {
        const notes = listNotes(args.file);
        console.log("Notes: " + notes.length);
        notes.forEach((note, index) => console.log(`${index + 1}. ${note.title}`));
      }
    )
    .command("read", "Read one note by its title", titleOption, args => {
      const note = readNote(args.title, args.file);
      console.log("Title: " + note.title);
      console.log("Body: " + note.body);
    })
    .command("remove", "Remove one note by its title", titleOption, args => {
      console.log("Note removed: " + removeNote(args.title, args.file));
    })
    .demandCommand(1, 1, "command not recognized", "command not recognized")
    .strict()
    .exitProcess(false)
    .showHelpOnFail(false)
    .version(false)
    .help()
    .fail((message, error) => {
      if (error) throw error;
      const failure = new Error(
        /Unknown (?:command|argument)|command not recognized/i.test(message)
          ? "command not recognized"
          : message
      );
      failure.exitCode = 2;
      throw failure;
    })
    .parseSync();
} catch (error) {
  // Keep failures useful in a terminal, without a stack trace or a silent reset.
  console.error(error.message);
  process.exitCode = error.exitCode ?? 1;
}
