// Daily Challenge: Show only the letters
// 🧠 Uses the DOM + Forms + event listeners
// ✔️ Core rule: keep only [A–Z a–z]; strip digits & special chars.

(function () {
  const form = document.getElementById("lettersForm");
  const input = document.getElementById("lettersInput");
  const echo = document.getElementById("echo");
  const helper = document.getElementById("helper");

  // ✅ Primary approach: 'input' event fires after every change (keyboard, paste, drag & drop, autofill)
  input.addEventListener("input", e => {
    const prev = input.value;
    // Keep only ASCII letters; remove everything else
    const cleaned = prev.replace(/[^a-z]/gi, "");
    if (cleaned !== prev) {
      const selStart = input.selectionStart;
      const offset = prev.length - cleaned.length;
      input.value = cleaned;
      // Try to preserve caret position when characters were stripped
      const newPos = Math.max(0, (selStart || cleaned.length) - offset);
      input.setSelectionRange(newPos, newPos);
      helper.textContent = "Non-letter characters were removed. ✅";
    } else {
      helper.textContent = "Numbers and special characters will be removed automatically. ✨";
    }
  });

  // 🛟 Optional alternative: prevent invalid keys before they land
  // Uncomment to proactively block keystrokes (still need input handler for paste).
  /*
  input.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return; // allow shortcuts
    const key = e.key;
    const letter = /^[a-z]$/i.test(key);
    const control = ['Backspace','Delete','ArrowLeft','ArrowRight','Home','End','Tab','Enter'].includes(key);
    if (!letter && !control) {
      e.preventDefault();
    }
  });
  */

  // 📨 Simple submit echo (no backend)
  form.addEventListener("submit", e => {
    e.preventDefault();
    echo.textContent = input.value ? `Submitted: "${input.value}" ✅` : "Nothing to submit.";
  });
})();
