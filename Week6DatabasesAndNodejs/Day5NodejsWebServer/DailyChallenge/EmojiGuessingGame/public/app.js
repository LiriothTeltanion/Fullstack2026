// Browser side: ask the server for a round, show the options, send the guess.
const emojiEl = document.getElementById("emoji");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const playerInput = document.getElementById("player");
const nextButton = document.getElementById("next");
const leaderboardEl = document.getElementById("leaderboard");

let currentRoundId = null;

async function loadRound() {
  feedbackEl.textContent = "";
  optionsEl.innerHTML = "";
  const response = await fetch("/api/round");
  const round = await response.json();
  currentRoundId = round.roundId;
  emojiEl.textContent = round.emoji;

  round.options.forEach(option => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => sendGuess(option));
    optionsEl.append(button);
  });
}

async function sendGuess(guess) {
  const player = playerInput.value.trim();
  if (!player) {
    feedbackEl.textContent = "Type your name first.";
    playerInput.focus();
    return;
  }

  const response = await fetch("/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roundId: currentRoundId, player, guess }),
  });
  const result = await response.json();
  if (!response.ok) {
    feedbackEl.textContent = result.error;
    return;
  }

  feedbackEl.textContent = result.correct ? "Correct!" : `Not this time, it was ${result.answer}.`;
  scoreEl.textContent = result.player.score;
  streakEl.textContent = result.player.streak;
  optionsEl.querySelectorAll("button").forEach(button => (button.disabled = true));
  loadLeaderboard();
}

async function loadLeaderboard() {
  const response = await fetch("/api/leaderboard");
  const players = await response.json();
  leaderboardEl.innerHTML = "";
  players.forEach(player => {
    const item = document.createElement("li");
    item.textContent = `${player.name}: ${player.score} points in ${player.rounds} rounds`;
    leaderboardEl.append(item);
  });
}

nextButton.addEventListener("click", loadRound);
loadRound();
loadLeaderboard();
