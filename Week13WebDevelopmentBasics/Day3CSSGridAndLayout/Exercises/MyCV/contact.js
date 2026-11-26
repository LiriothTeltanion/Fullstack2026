// Pure helpers keep validation and the handoff text independently testable.
export function validateDraft(name, body) {
  const cleanName = String(name ?? "")
    .trim()
    .replace(/\s+/gu, " ");
  const cleanBody = String(body ?? "")
    .replace(/\r\n?/gu, "\n")
    .trim();
  const errors = {};
  if (!cleanName || [...cleanName].length > 80) {
    errors.name = "Enter your name using 1–80 characters.";
  }
  if (!cleanBody || [...cleanBody].length > 2000) {
    errors.body = "Enter a message using 1–2000 characters.";
  }
  return { name: cleanName, body: cleanBody, errors };
}

export function formatMessage(name, body) {
  return `Hello Kevin,\n\n${body}\n\nBest regards,\n${name}\n\nPrepared from your public CV page.`;
}

// This key belongs only to this form. No analytics, network request or automatic send.
const DRAFT_KEY = "kevin-cv-contact-draft-v1";

function initializeContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;
  const name = document.querySelector("#contact-name");
  const body = document.querySelector("#contact-message");
  const status = document.querySelector("#contact-status");
  const prepared = document.querySelector("#prepared-message");
  const output = document.querySelector("#message-copy");
  const nameError = document.querySelector("#name-error");
  const bodyError = document.querySelector("#message-error");
  let storageAvailable = true;

  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
    if (draft && typeof draft.name === "string" && typeof draft.body === "string") {
      // HTML lengths use UTF-16 units; restore our Unicode code-point limits intact.
      name.value = [...draft.name].slice(0, 80).join("");
      body.value = [...draft.body].slice(0, 2000).join("");
      status.textContent = "Your draft was restored in this tab. Review it before preparing.";
    }
  } catch {
    storageAvailable = false;
    status.textContent = "Draft storage is unavailable. Keep this tab open to retain your text.";
  }

  function saveDraft() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ name: name.value, body: body.value }));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
  }

  form.addEventListener("input", () => {
    saveDraft();
    prepared.hidden = true;
    output.value = "";
    nameError.textContent = "";
    bodyError.textContent = "";
    name.removeAttribute("aria-invalid");
    body.removeAttribute("aria-invalid");
    status.textContent = storageAvailable
      ? "Draft saved in this tab. Prepare it when ready."
      : "Draft storage is unavailable. Your text remains here while this page stays open.";
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const draft = validateDraft(name.value, body.value);
    nameError.textContent = draft.errors.name || "";
    bodyError.textContent = draft.errors.body || "";
    name.setAttribute("aria-invalid", String(Boolean(draft.errors.name)));
    body.setAttribute("aria-invalid", String(Boolean(draft.errors.body)));
    if (Object.keys(draft.errors).length) {
      prepared.hidden = true;
      status.textContent = "Check the highlighted fields. Nothing has been sent.";
      (draft.errors.name ? name : body).focus();
      return;
    }
    saveDraft();
    output.value = formatMessage(draft.name, draft.body);
    prepared.hidden = false;
    status.textContent =
      "Message prepared, not sent. Copy it, open LinkedIn and complete the send there.";
    output.focus();
    output.setSelectionRange(0, 0);
    output.scrollTop = 0;
  });

  document.querySelector("#copy-message").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(output.value);
      status.textContent =
        "Message copied, not sent. Paste it into LinkedIn and review before sending.";
    } catch {
      output.focus();
      output.select();
      status.textContent =
        "Automatic copying is unavailable. The message is selected; copy it manually, then paste it into LinkedIn.";
    }
  });

  document.querySelector("#clear-draft").addEventListener("click", () => {
    form.reset();
    prepared.hidden = true;
    output.value = "";
    nameError.textContent = "";
    bodyError.textContent = "";
    name.removeAttribute("aria-invalid");
    body.removeAttribute("aria-invalid");
    try {
      sessionStorage.removeItem(DRAFT_KEY);
      status.textContent = "Draft cleared from this page and this tab's session storage.";
    } catch {
      status.textContent =
        "Text cleared here. Browser storage is unavailable; close the tab to end its session.";
    }
    name.focus();
  });
  document.querySelector("#prepare-message").disabled = false;
  document.querySelector("#clear-draft").disabled = false;
}

if (typeof document !== "undefined") initializeContactForm();
