// Multiplayer Strategy: the server owns the Game and the browsers only send moves.
import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { Game } from "./game/Game.js";

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

let players = []; // socket ids, index 0 = Player 1 (A), index 1 = Player 2 (B)
let game = null;

function broadcast() {
  io.emit("game:state", game ? game.state() : null);
}

function startGame() {
  game = new Game();
  io.emit("game:message", "Both players are here. Player A starts!");
  broadcast();
}

io.on("connection", socket => {
  if (players.length < 2) {
    players.push(socket.id);
    socket.emit("game:role", players.length - 1);
    if (players.length === 2) startGame();
    else socket.emit("game:message", "Waiting for a second player...");
  } else {
    socket.emit("game:role", null); // third tab and later just watch
    socket.emit("game:state", game ? game.state() : null);
  }

  socket.on("game:move", direction => {
    const player = players.indexOf(socket.id);
    if (!game || player === -1) return;
    const result = game.move(player, direction);
    if (!result.ok) return socket.emit("game:message", result.error);
    broadcast();
  });

  socket.on("game:restart", () => {
    if (players.length === 2 && players.includes(socket.id)) startGame();
  });

  socket.on("disconnect", () => {
    if (!players.includes(socket.id)) return;
    players = players.filter(id => id !== socket.id);
    game = null;
    // The player who stays becomes Player A and waits for someone new.
    players.forEach((id, index) => io.to(id).emit("game:role", index));
    io.emit("game:message", "A player left. Waiting for a new opponent...");
    broadcast();
  });
});

httpServer.listen(PORT, () => {
  console.log(`Territory game on http://localhost:${PORT} (open it in two tabs)`);
});
