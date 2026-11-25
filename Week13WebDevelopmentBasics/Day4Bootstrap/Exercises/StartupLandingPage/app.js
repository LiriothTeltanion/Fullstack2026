import { MAILCHIMP_SIGNUP_URL } from "./signup-config.js";

const link = document.getElementById("subscribe-link");
const note = document.getElementById("subscription-note");
if (MAILCHIMP_SIGNUP_URL) {
  try {
    const signup = new URL(MAILCHIMP_SIGNUP_URL);
    if (signup.protocol !== "https:") {
      throw new Error("The public signup URL must use HTTPS.");
    }
    link.href = signup.href;
    note.textContent = "The button opens the studio's public subscription form.";
  } catch {
    note.textContent =
      "The signup URL needs a valid HTTPS address. This page is showing its local demo.";
  }
}
