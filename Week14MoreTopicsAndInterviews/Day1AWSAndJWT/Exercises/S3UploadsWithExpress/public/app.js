// Browser side: send the form as multipart/form-data and list the bucket.
const form = document.getElementById("upload-form");
const statusText = document.getElementById("status");
const list = document.getElementById("file-list");

function formatSize(bytes) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.ceil(bytes / 1024)} KB`;
}

async function loadFiles() {
  const response = await fetch("/api/files");
  const files = await response.json();
  list.innerHTML = "";

  if (files.length === 0) {
    list.innerHTML = "<li class='muted'>No files yet.</li>";
    return;
  }

  for (const file of files) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${file.key.replace("uploads/", "")} · ${formatSize(file.size)}`;

    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.textContent = "Open";
    openButton.addEventListener("click", () => openFile(file.key));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "danger";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteFile(file.key));

    item.append(name, openButton, deleteButton);
    list.append(item);
  }
}

async function openFile(key) {
  // Open the tab during the click, before the await, so popup blockers allow it
  const tab = window.open("", "_blank");
  const response = await fetch(`/api/files/url?key=${encodeURIComponent(key)}`);
  const { url } = await response.json();
  tab.opener = null;
  tab.location.href = url;
}

async function deleteFile(key) {
  await fetch(`/api/files?key=${encodeURIComponent(key)}`, { method: "DELETE" });
  statusText.textContent = "File deleted.";
  loadFiles();
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  statusText.textContent = "Uploading…";

  // FormData builds the multipart body; the browser sets the Content-Type header
  const response = await fetch("/api/files", { method: "POST", body: new FormData(form) });
  const data = await response.json();

  statusText.textContent = response.ok ? `Uploaded as ${data.key}` : data.error;
  if (response.ok) {
    form.reset();
    loadFiles();
  }
});

loadFiles().catch(() => {
  statusText.textContent = "Could not reach the server.";
});
