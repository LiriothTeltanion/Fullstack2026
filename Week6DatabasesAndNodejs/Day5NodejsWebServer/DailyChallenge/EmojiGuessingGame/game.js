// Game logic, kept apart from the server so it is easy to read and test.

export const EMOJIS = [
  { emoji: "😀", name: "Smile" },
  { emoji: "🐶", name: "Dog" },
  { emoji: "🌮", name: "Taco" },
  { emoji: "🎸", name: "Guitar" },
  { emoji: "🚀", name: "Rocket" },
  { emoji: "🌋", name: "Volcano" },
  { emoji: "🐙", name: "Octopus" },
  { emoji: "☕", name: "Coffee" },
  { emoji: "🎧", name: "Headphones" },
  { emoji: "🦉", name: "Owl" },
];

const OPTIONS_PER_ROUND = 4;

// Fisher-Yates shuffle on a copy, so EMOJIS keeps its order
function shuffle(list, random = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A round = one emoji to guess + four names to choose from (one is right)
export function createRound(random = Math.random) {
  const picked = shuffle(EMOJIS, random).slice(0, OPTIONS_PER_ROUND);
  const answer = picked[0];
  return {
    emoji: answer.emoji,
    answer: answer.name,
    options: shuffle(picked, random).map(item => item.name),
  };
}

// Players: name -> { score, rounds, streak }
export function createScoreboard() {
  const players = new Map();

  return {
    record(name, correct) {
      const player = players.get(name) ?? { name, score: 0, rounds: 0, streak: 0 };
      player.rounds++;
      if (correct) {
        player.streak++;
        player.score += player.streak >= 3 ? 2 : 1; // bonus point from the third right answer in a row
      } else {
        player.streak = 0;
      }
      players.set(name, player);
      return { ...player };
    },

    top(limit = 5) {
      return [...players.values()]
        .sort((a, b) => b.score - a.score || a.rounds - b.rounds)
        .slice(0, limit);
    },
  };
}
