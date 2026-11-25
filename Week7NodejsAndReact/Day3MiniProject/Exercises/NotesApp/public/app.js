// Front end of the notes app: fetch() calls to /api/notes.
const form = document.querySelector("#note-form");
const idInput = document.querySelector("#note-id");
const titleInput = document.querySelector("#title");
const bodyInput = document.querySelector("#body");
const saveButton = document.querySelector("#save");
const cancelButton = document.querySelector("#cancel");
const list = document.querySelector("#notes");
const message = document.querySelector("#message");
const search = document.querySelector("#search");

async function api(path, options = {}) {
  const response = await fetch(`/api/notes${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

function resetForm() {
  form.reset();
  idInput.value = "";
  saveButton.textContent = "Add note";
  cancelButton.hidden = true;
}

function startEdit(note) {
  idInput.value = note.id;
  titleInput.value = note.title;
  bodyInput.value = note.body;
  saveButton.textContent = "Save changes";
  cancelButton.hidden = false;
  titleInput.focus();
}

function renderNote(note) {
  const li = document.createElement("li");
  li.className = "note";

  const title = document.createElement("h2");
  title.textContent = note.title;
  const body = document.createElement("p");
  body.textContent = note.body;
  const date = document.createElement("span");
  date.className = "date";
  date.textContent = `Updated ${new Date(note.updatedAt).toLocaleString()}`;

  const edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEdit(note));

  const remove = document.createElement("button");
  remove.textContent = "Delete";
  remove.className = "danger";
  remove.addEventListener("click", async () => {
    if (!confirm(`Delete "${note.title}"?`)) return;
    try {
      await api(`/${note.id}`, { method: "DELETE" });
      await loadNotes();
    } catch (err) {
      message.textContent = err.message;
    }
  });

  li.append(title, body, date, document.createElement("br"), edit, " ", remove);
  return li;
}

// A slower earlier search must not replace the results for the current input.
let latestLoad = 0;
async function loadNotes() {
  const request = ++latestLoad;
  try {
    const q = encodeURIComponent(search.value.trim());
    const notes = await api(q ? `?q=${q}` : "");
    if (request !== latestLoad) return;
    list.replaceChildren(...notes.map(renderNote));
    message.textContent = notes.length ? "" : "No notes yet.";
  } catch (err) {
    if (request === latestLoad) message.textContent = err.message;
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const payload = JSON.stringify({ title: titleInput.value, body: bodyInput.value });
  try {
    if (idInput.value) {
      await api(`/${idInput.value}`, { method: "PUT", body: payload });
    } else {
      await api("", { method: "POST", body: payload });
    }
    resetForm();
    loadNotes();
  } catch (err) {
    message.textContent = err.message;
  }
});

cancelButton.addEventListener("click", resetForm);
search.addEventListener("input", loadNotes);

loadNotes();
