// One source for field identity, presentation and validation messages.
export const FIELD_DEFINITIONS = Object.freeze([
  {
    name: "fullName",
    label: "Full name",
    type: "text",
    autoComplete: "name",
    hint: "Up to 80 characters; accented names and Hebrew are welcome.",
    messages: {
      required: "Enter your name.",
      length: "Use 80 characters or fewer.",
      format: "Use letters, spaces, numbers, apostrophes, periods or hyphens.",
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
    hint: "Use sample details, such as learner@example.test.",
    messages: {
      required: "Enter an email address.",
      format: "Use an address such as learner@example.test.",
    },
  },
  {
    name: "password",
    label: "Practice password",
    type: "password",
    autoComplete: "new-password",
    hint: "8–128 characters, with a letter and a number.",
    messages: {
      required: "Enter a practice password.",
      length: "Use 8–128 characters.",
      format: "Include at least one letter and one number.",
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm practice password",
    type: "password",
    autoComplete: "new-password",
    hint: "Repeat the same practice password.",
    messages: {
      required: "Confirm your practice password.",
      mismatch: "The two passwords must match.",
    },
  },
]);
export const FIELD_ORDER = Object.freeze(FIELD_DEFINITIONS.map(field => field.name));
const definitions = Object.fromEntries(FIELD_DEFINITIONS.map(field => [field.name, field]));

// A deliberately bounded syntax check, not a mailbox or delivery verification.
function isPracticeEmail(email) {
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  const labels = domain.split(".");
  return (
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    labels.length >= 2 &&
    labels.every(label => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))
  );
}

// These explicit practice rules are independent of browser constraint validation.
export function validateProfile(values) {
  const input = values && typeof values === "object" && !Array.isArray(values) ? values : {};
  const errors = {};
  const rawName = typeof input.fullName === "string" ? input.fullName : "";
  const fullName = rawName.normalize("NFC").trim().replace(/\s+/gu, " ");
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const confirmation = typeof input.confirmPassword === "string" ? input.confirmPassword : "";

  if (!fullName) errors.fullName = definitions.fullName.messages.required;
  else if (Array.from(fullName).length > 80) errors.fullName = definitions.fullName.messages.length;
  else if (/[\p{Cc}\p{Cf}]/u.test(rawName) || !/^\p{L}[\p{L}\p{M}\p{N} .'’-]*$/u.test(fullName)) {
    errors.fullName = definitions.fullName.messages.format;
  }

  if (!email) errors.email = definitions.email.messages.required;
  else if (email.length > 254 || !isPracticeEmail(email)) {
    errors.email = definitions.email.messages.format;
  }

  if (!password) errors.password = definitions.password.messages.required;
  else if (Array.from(password).length < 8 || Array.from(password).length > 128)
    errors.password = definitions.password.messages.length;
  else if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) {
    errors.password = definitions.password.messages.format;
  }

  if (!confirmation) errors.confirmPassword = definitions.confirmPassword.messages.required;
  else if (confirmation !== password)
    errors.confirmPassword = definitions.confirmPassword.messages.mismatch;

  // Deliberately omit both passwords from the normalized preview data.
  return { valid: Object.keys(errors).length === 0, errors, preview: { fullName, email } };
}
