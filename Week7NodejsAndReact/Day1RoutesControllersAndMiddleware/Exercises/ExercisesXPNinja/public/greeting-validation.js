// Share the same small input contract between the browser and Express.
export const EMOJI_OPTIONS = Object.freeze([
  { value: "👋", label: "Wave" },
  { value: "😊", label: "Smile" },
  { value: "☀️", label: "Sunshine" },
  { value: "🎉", label: "Celebrate" },
  { value: "🚀", label: "Rocket" },
  { value: "💙", label: "Blue heart" },
]);

export function validateGreeting(input) {
  const body = input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const fields = {};
  let name = "";

  if (typeof body.name !== "string" || /[\p{Cc}\p{Cf}]/u.test(body.name)) {
    fields.name = "Enter your name as plain text.";
  } else {
    name = body.name.normalize("NFC").trim().replace(/\s+/gu, " ");
    if (!name) fields.name = "Enter your name.";
    else if (Array.from(name).length > 60) fields.name = "Use a name of 60 characters or fewer.";
    else if (!/^\p{L}[\p{L}\p{M}\p{N} .'’-]*$/u.test(name)) {
      fields.name = "Use letters, spaces, numbers, apostrophes, periods or hyphens.";
    }
  }

  if (
    typeof body.emoji !== "string" ||
    !EMOJI_OPTIONS.some(option => option.value === body.emoji)
  ) {
    fields.emoji = "Choose one of the listed emoji.";
  }

  return Object.keys(fields).length
    ? { valid: false, fields }
    : { valid: true, value: { name, emoji: body.emoji } };
}
