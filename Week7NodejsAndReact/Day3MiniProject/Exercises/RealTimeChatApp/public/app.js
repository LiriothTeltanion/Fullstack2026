/* global io */
// Browser side of the chat. io() comes from /socket.io/socket.io.js.
const socket = io();

const joinForm = document.querySelector("#join-form");
const chat = document.querySelector("#chat");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const typingEl = document.querySelector("#typing");

const sendButton = messageForm.querySelector('button[type="submit"]');
const joinButton = joinForm.querySelector('button[type="submit"]');
let session = null;
let requestedSocketId = null;
let confirmedSocketId = null;
let typingTimer;
sendButton.disabled = true;

// A transport reconnect has a new socket. Join before enabling message submission.
function joinCurrentSession() {
  if (!session || !socket.connected || requestedSocketId === socket.id) return;
  requestedSocketId = socket.id;
  confirmedSocketId = null;
  sendButton.disabled = true;
  joinButton.disabled = true;
  socket.emit("join", session);
}

socket.on("connect", joinCurrentSession);
socket.on("disconnect", () => {
  requestedSocketId = null;
  confirmedSocketId = null;
  sendButton.disabled = true;
  joinButton.disabled = Boolean(session);
  clearTimeout(typingTimer);
  typingEl.textContent = "";
});

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
  if (joinButton.disabled) return;
  const username = document.querySelector("#username").value;
  const room = document.querySelector("#room").value;
  session = {
    username: username.trim().slice(0, 20),
    room: room.trim().slice(0, 20) || "general",
  };
  requestedSocketId = null;
  confirmedSocketId = null;
  joinButton.disabled = true;
  joinCurrentSession();
});

messageForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!session || !socket.connected || confirmedSocketId !== socket.id) return;
  socket.emit("chat:message", messageInput.value);
  socket.emit("chat:typing", false);
  messageInput.value = "";
});

messageInput.addEventListener("input", () => {
  if (!socket.connected || confirmedSocketId !== socket.id) return;
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
  // This room event arrives after the server has registered and joined this socket.
  if (
    session &&
    socket.connected &&
    requestedSocketId === socket.id &&
    names.includes(session.username)
  ) {
    const firstConfirmation = confirmedSocketId !== socket.id;
    confirmedSocketId = socket.id;
    sendButton.disabled = false;
    joinButton.disabled = false;
    if (firstConfirmation) {
      document.querySelector("#room-title").textContent = "#" + session.room;
      joinForm.hidden = true;
      chat.hidden = false;
      messageInput.focus();
    }
  }
  document.querySelector("#users").textContent = `Online: ${names.join(", ")}`;
});

socket.on("chat:error", text => {
  session = null;
  requestedSocketId = null;
  confirmedSocketId = null;
  sendButton.disabled = true;
  joinButton.disabled = false;
  joinForm.hidden = false;
  chat.hidden = true;
  alert(text);
});
