// Plays a short scripted game in the terminal: node game/demo.js
import { Game } from "./Game.js";

const game = new Game();
const script = [
  [0, "right"],
  [1, "left"],
  [0, "down"],
  [1, "up"],
  [1, "up"], // wrong turn on purpose
  [0, "left"],
  [1, "up"],
];

for (const [player, direction] of script) {
  const result = game.move(player, direction);
  console.log(`Player ${player + 1} ${direction}: ${result.ok ? "ok" : result.error}`);
}

const symbols = { null: ".", 0: "A", 1: "B" };
const { size, owner, scores, turnsLeft } = game.state();
for (let y = 0; y < size; y++) {
  console.log(
    owner
      .slice(y * size, y * size + size)
      .map(o => symbols[o])
      .join(" ")
  );
}
console.log(`Scores: A=${scores[0]} B=${scores[1]}, turns left: ${turnsLeft}`);
