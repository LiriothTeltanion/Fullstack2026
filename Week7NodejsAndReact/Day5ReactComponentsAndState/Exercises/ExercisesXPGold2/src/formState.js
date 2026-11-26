// Validation is shared by React and the small Node test suite. Values remain
// strings while editing; normalization happens only when producing a preview.
export const EMPTY_PROFILE = { fullName: "", email: "" };
export const EMPTY_PRACTICE = { topic: "", pace: "steady", notes: "", reminders: false };
export const TOPICS = ["React state", "Accessible forms", "Component composition"];
export const PACES = ["steady", "focused"];

const characterCount = value => Array.from(value).length;

export function validateProfile(values) {
  const errors = {};
  const fullName = values.fullName.trim();
  if (!fullName) errors.fullName = "Enter your name.";
  else if (characterCount(fullName) > 80) errors.fullName = "Use at most 80 characters.";
  else if (/[\p{Cc}\p{Cf}]/u.test(fullName)) errors.fullName = "Use printable characters only.";

  const email = values.email.trim();
  if (!email) errors.email = "Enter an email address.";
  else if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(email) ||
    /[\p{Cc}\p{Cf}]/u.test(email)
  )
    errors.email = "Use an email address such as learner@example.test.";
  return errors;
}

export function validatePractice(values) {
  const errors = {};
  if (!TOPICS.includes(values.topic)) errors.topic = "Choose a practice topic.";
  if (!PACES.includes(values.pace)) errors.pace = "Choose a practice pace.";
  if (characterCount(values.notes.trim()) > 300) errors.notes = "Use at most 300 characters.";
  return errors;
}

export function profilePreview(values) {
  return { fullName: values.fullName.trim(), email: values.email.trim() };
}

export function practicePreview(values) {
  return { ...values, notes: values.notes.trim() };
}
