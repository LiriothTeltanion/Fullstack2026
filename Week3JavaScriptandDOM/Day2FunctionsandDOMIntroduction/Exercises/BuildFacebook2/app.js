import { database, signIn } from "./auth.js";

const status = document.getElementById("status");
const feed = document.getElementById("feed");
document.getElementById("accounts").textContent = database
  .map(user => user.username + " / " + user.password)
  .join(" · ");

document.getElementById("sign-in").addEventListener("click", () => {
  const username = prompt("Enter a demo username:");
  const password = prompt("Enter its demo password:");
  feed.replaceChildren();
  if (username === null || password === null) {
    status.textContent = "Sign-in cancelled.";
    return;
  }
  const entries = signIn(username, password);
  if (entries === null) {
    status.textContent = "The username and password did not match.";
    alert("The username and password did not match.");
    return;
  }
  status.textContent = "Signed in as " + username + ". The feed is also in the console.";
  for (const entry of entries) {
    const item = document.createElement("li");
    item.textContent = entry.username + ": " + entry.timeline;
    feed.append(item);
  }
});
