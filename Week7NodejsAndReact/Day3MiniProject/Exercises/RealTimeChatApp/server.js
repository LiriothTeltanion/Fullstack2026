// Real-time chat: Express serves the page, Socket.IO carries the messages.
import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

// Every IP gets at most 100 requests per 15 minutes, so one client can't flood the server.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

app.use(express.static("public"));

// socket.id -> { username, room }
const users = new Map();

function usersIn(room) {
  return [...users.values()].filter(u => u.room === room).map(u => u.username);
}

function time() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

io.on("connection", socket => {
  socket.on("join", ({ username, room }) => {
    const name = String(username || "")
      .trim()
      .slice(0, 20);
    const roomName =
      String(room || "general")
        .trim()
        .slice(0, 20) || "general";
    if (!name) return socket.emit("chat:error", "Pick a username first");

    users.set(socket.id, { username: name, room: roomName });
    socket.join(roomName);

    socket.emit("chat:system", { text: `Welcome to #${roomName}, ${name}`, time: time() });
    socket.to(roomName).emit("chat:system", { text: `${name} joined`, time: time() });
    io.to(roomName).emit("room:users", usersIn(roomName));
  });

  socket.on("chat:message", text => {
    const user = users.get(socket.id);
    const clean = String(text || "")
      .trim()
      .slice(0, 500);
    if (!user || !clean) return;
    io.to(user.room).emit("chat:message", { username: user.username, text: clean, time: time() });
  });

  socket.on("chat:typing", isTyping => {
    const user = users.get(socket.id);
    if (user)
      socket
        .to(user.room)
        .emit("chat:typing", { userId: socket.id, username: user.username, isTyping });
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (!user) return;
    users.delete(socket.id);
    // Stop only this participant's notice, including when their tab closes abruptly.
    socket.to(user.room).emit("chat:typing", {
      userId: socket.id,
      username: user.username,
      isTyping: false,
    });
    io.to(user.room).emit("chat:system", { text: `${user.username} left`, time: time() });
    io.to(user.room).emit("room:users", usersIn(user.room));
  });
});

httpServer.listen(PORT, () => {
  console.log(`Chat running on http://localhost:${PORT}`);
});
