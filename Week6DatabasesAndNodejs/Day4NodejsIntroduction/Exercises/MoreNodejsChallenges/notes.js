// A command-line notes app.
//   node notes.js add "Title" "Body text"
//   node notes.js list
//   node notes.js read <id>
//   node notes.js search <text>
//   node notes.js remove <id>
import { loadNotes, saveNotes, addNote, removeNote, searchNotes } from "./notesStore.js";

const [command, ...args] = process.argv.slice(2);

const printNote = note => console.log(`#${note.id} ${note.title} (${note.created})`);

const commands = {
  async add(title, body = "") {
    if (!title) throw new Error('Usage: node notes.js add "Title" "Body"');
    const notes = addNote(await loadNotes(), title, body);
    await saveNotes(notes);
    console.log(`Added note #${notes.at(-1).id}: ${title}`);
  },

  async list() {
    const notes = await loadNotes();
    if (notes.length === 0) return console.log("No notes yet.");
    console.log(`${notes.length} note(s):`);
    notes.forEach(printNote);
  },

  async read(id) {
    const note = (await loadNotes()).find(n => n.id === Number(id));
    if (!note) throw new Error(`No note with id ${id}`);
    printNote(note);
    console.log(note.body || "(empty)");
  },

  async search(text = "") {
    const found = searchNotes(await loadNotes(), text);
    console.log(`${found.length} match(es) for "${text}"`);
    found.forEach(printNote);
  },

  async remove(id) {
    const notes = removeNote(await loadNotes(), Number(id));
    await saveNotes(notes);
    console.log(`Removed note #${id}`);
  },
};

if (!Object.hasOwn(commands, command)) {
  console.log("Commands: add, list, read, search, remove");
  process.exitCode = 1;
} else {
  try {
    await commands[command](...args);
  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}
