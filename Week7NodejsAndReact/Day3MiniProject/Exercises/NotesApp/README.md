# 🎮 Mini Project - Notes App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/notes-app-1218b18800.svg" width="100%" alt="Progress card for Notes App">

</div>

A terminal notes app with `add`, `list`, `read` and `remove` commands, backed by a
local JSON file. The existing Express API and browser page remain available as
an independent web demonstration; their source and sample notes are preserved.

## Terminal workflow

Use Node **20 (20.19+), 22 (22.12+) or 23+** as specified by `package.json`, then install the
locked dependencies:

```bash
npm ci
node app add --title="Piano practice" --body="Scales first, then a new melody."
node app list
node app read --title="Piano practice"
node app remove --title="Piano practice"
```

`app.js` uses [Yargs](https://github.com/yargs/yargs) to parse commands and options.
`notes.js` exports the storage operations, uses synchronous Node file reads/writes
and [Lodash](https://lodash.com/docs) for title lookup and removal.

| Command                      | Result                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| `add --title=... --body=...` | Save a new note; a duplicate title reports `Note already exists` and preserves the original |
| `list`                       | Display the note count and all titles                                                       |
| `read --title=...`           | Display the matching title and body, or report `Note not found`                             |
| `remove --title=...`         | Delete only the matching title, or report `Note not found`                                  |
| Unknown command              | Report `command not recognized` and return a nonzero exit code                              |

Titles are case-sensitive and trimmed at their outer edges. The title must be
nonempty and `--body` must be supplied; an empty body remains valid text. Unicode,
quotes and multiline bodies are preserved. `node app --help` describes all options.

The default terminal store is **`data/cli-notes.json`**, created on the first add
and ignored by Git. It is separate from the web demo's `data/notes.json` because
the two interfaces use different record shapes. Use an explicit separate file
for another notebook or a disposable demonstration:

```bash
node app add --file="./demo-notes.json" --title="Study" --body="Explain this module."
node app read --file="./demo-notes.json" --title="Study"
```

A complete new JSON document is written before replacing the old file. A writer
lock prevents concurrent commands from silently overwriting each other; a busy
file returns an error. An existing lock is never taken over automatically.
Malformed JSON or incompatible records are reported and left intact. List and
help do not create a missing store. The CLI does not start a web server or use
the network.

## Offline tests

```bash
npm test
```

The suite runs the real commands in separate Node processes against disposable
temporary files. A preload guard rejects network calls in every CLI child
command. Use `npm run test:cli` to select only these terminal tests. Coverage
includes persistence, Unicode/multiline text,
duplicates, missing titles, invalid arguments, corrupt data, writer locks and
preservation of the existing web notes. See [tests](tests/README.md).

## Web demonstration

The retained Express API under `/api/notes` saves to `data/notes.json`. Its page
in `public/` can write, edit, search and delete notes.

## ▶️ How to run

```bash
npm ci
cp .env.example .env   # optional: it only sets PORT, 3000 by default
npm run dev
```

Open http://localhost:3000. The API on its own:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Shopping","body":"Green tea, coffee beans"}' http://localhost:3000/api/notes
curl "http://localhost:3000/api/notes?q=coffee"
```

```
{"id":2,"title":"Shopping","body":"Green tea, coffee beans","updatedAt":"2026-11-25T13:46:35.179Z"}
[{"id":2,"title":"Shopping","body":"Green tea, coffee beans","updatedAt":"2026-11-25T13:46:35.179Z"}]
```

## 🎯 The challenge

| Route                   | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `GET /api/notes`        | All notes, newest first; `?q=` searches title and body |
| `POST /api/notes`       | New note, `title` required                             |
| `PUT /api/notes/:id`    | Replaces title and body and updates `updatedAt`        |
| `DELETE /api/notes/:id` | 204, or 404 if the id does not exist                   |

On the page, the same form adds and edits: `startEdit()` fills it and puts the id in a hidden input, and the submit handler sends `PUT` when that id is set and `POST` when it is empty. The search box reloads the list on every keystroke.

## 🧠 What I learned

Run `npm test` from this folder to exercise the HTTP API with a temporary notes file. The suite creates ten notes at once and checks that each one survives with its own ID. It also covers malformed JSON and recovery after an unsuccessful update. A single server process serializes reads and writes, then replaces the JSON file atomically. The browser keeps the latest search result when responses arrive out of order.

- One small `api()` helper in the browser handles the headers, the 204 case and the error messages for every call
- Building the note cards with `createElement` and `textContent` is longer than `innerHTML`, but a note can never inject HTML
- ISO dates can be sorted with `localeCompare`, so "newest first" needed no `Date` objects
- `list.replaceChildren(...)` swaps the whole list in one step
- Every API call reads or writes the notes file, so `express-rate-limit` allows each IP 100 requests per 15 minutes and answers 429 after that

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 3 - Mini-project Day - Mini Project

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
