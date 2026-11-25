/* global io */
// Browser side of the chat. io() comes from /socket.io/socket.io.js.
const socket = io();

const joinForm = document.querySelector("#join-form");
const chat = document.querySelector("#chat");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const typingEl = document.querySelector("#typing");

// textContent (not innerHTML) so nobody can inject HTML through a message.
function addLine(text, time, className) {
  const li = document.createElement("li");
  if (className) li.className = className;
  const stamp = document.createElement("span");
  stamp.className = "time";
  stamp.textContent = `${time} `;
  li.append(stamp, text);
  messages.append(li);
  messages.scrollTop = messages.scrollHeight;
}

joinForm.addEventListener("submit", event => {
  event.preventDefault();
  const username = document.querySelector("#username").value;
  const room = document.querySelector("#room").value;
  socket.emit("join", { username, room });
  document.querySelector("#room-title").textContent = `#${room || "general"}`;
  joinForm.hidden = true;
  chat.hidden = false;
  messageInput.focus();
});

messageForm.addEventListener("submit", event => {
  event.preventDefault();
  socket.emit("chat:message", messageInput.value);
  socket.emit("chat:typing", false);
  messageInput.value = "";
});

let typingTimer;
messageInput.addEventListener("input", () => {
  socket.emit("chat:typing", true);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => socket.emit("chat:typing", false), 1200);
});

socket.on("chat:message", ({ username, text, time }) => {
  addLine(`${username}: ${text}`, time);
});

socket.on("chat:system", ({ text, time }) => addLine(text, time, "system"));

socket.on("chat:typing", ({ username, isTyping }) => {
  typingEl.textContent = isTyping ? `${username} is typing...` : "";
});

socket.on("room:users", names => {
  document.querySelector("#users").textContent = `Online: ${names.join(", ")}`;
});

socket.on("chat:error", text => {
  joinForm.hidden = false;
  chat.hidden = true;
  alert(text);
});
