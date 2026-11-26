/* global io */
const socket = io();
const board = document.querySelector("#board");
const statusEl = document.querySelector("#status");
const roleEl = document.querySelector("#role");
const moveButtons = document.querySelectorAll("[data-dir]");
const restartButton = document.querySelector("#restart");
const NAMES = ["A", "B"];
let myRole = null;
let gameState = null;

function canPlay() {
  return socket.connected && myRole !== null && gameState !== null;
}

function canMove() {
  return canPlay() && !gameState.over && gameState.current === myRole;
}

function updateControls() {
  for (const button of moveButtons) button.disabled = !canMove();
  restartButton.disabled = !canPlay();
}

function render(state) {
  gameState = state;
  updateControls();
  board.innerHTML = "";
  if (!state) return;

  state.owner.forEach((owner, index) => {
    const cell = document.createElement("div");
    cell.className = "cell" + (owner === 0 ? " a" : owner === 1 ? " b" : "");
    const x = index % state.size;
    const y = Math.floor(index / state.size);
    state.positions.forEach((pos, player) => {
      if (pos.x === x && pos.y === y) cell.textContent = NAMES[player];
    });
    board.append(cell);
  });

  const score = `A ${state.scores[0]} : ${state.scores[1]} B`;
  if (state.over) {
    const result = state.winner === "draw" ? "It's a draw" : `Player ${NAMES[state.winner]} wins`;
    statusEl.textContent = `${result}! ${score}`;
  } else {
    const whose = state.current === myRole ? "Your turn" : `Player ${NAMES[state.current]}'s turn`;
    statusEl.textContent = `${whose} · ${score} · ${state.turnsLeft} turns left`;
  }
}

function sendMove(direction) {
  // A move belongs to this game. Never replay it in a new game after reconnecting.
  if (canMove()) socket.volatile.emit("game:move", direction);
}

moveButtons.forEach(button => {
  button.addEventListener("click", () => sendMove(button.dataset.dir));
});

const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
document.addEventListener("keydown", event => {
  if (KEYS[event.key] && canMove()) {
    event.preventDefault();
    sendMove(KEYS[event.key]);
  }
});

restartButton.addEventListener("click", () => {
  if (canPlay()) socket.volatile.emit("game:restart");
});

function showDisconnected() {
  myRole = null;
  roleEl.textContent = "";
  render(null);
  statusEl.textContent = "Disconnected. Waiting to reconnect…";
}

socket.on("disconnect", showDisconnected);
socket.on("connect_error", showDisconnected);

socket.on("game:role", role => {
  myRole = role;
  updateControls();
  roleEl.textContent = role === null ? "You are watching" : `You are Player ${NAMES[role]}`;
});
socket.on("game:state", render);
socket.on("game:message", text => {
  statusEl.textContent = text;
});
