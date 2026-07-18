// GoWildcats — Daily Challenge (Advanced array methods with forEach)
// -----------------------------------------------------------------
// Single-file solution using forEach to produce the requested arrays and totals.
// Includes a small demo (console logs). Keep ONLY this file in your submission folder if needed.

type Player = {
  username: string;
  team: string;
  score: number;
  items: string[];
};

export const gameInfo: Player[] = [
  { username: "john", team: "red", score: 5, items: ["ball", "book", "pen"] },
  { username: "becky", team: "blue", score: 10, items: ["tape", "backpack", "pen"] },
  { username: "susy", team: "red", score: 55, items: ["ball", "eraser", "pen"] },
  { username: "tyson", team: "green", score: 1, items: ["book", "pen"] },
];

// 1) Using forEach: usernames with "!" appended
export const usernames: string[] = [];
gameInfo.forEach(p => {
  usernames.push(p.username + "!");
});

// 2) Using forEach: winners (score > 5)
export const winners: string[] = [];
gameInfo.forEach(p => {
  if (p.score > 5) winners.push(p.username);
});

// 3) Using forEach: total score
export let totalScore = 0;
gameInfo.forEach(p => {
  totalScore += p.score;
});

// Demo output
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log("usernames:", usernames); // ["john!", "becky!", "susy!", "tyson!"]
  console.log("winners:", winners); // ["becky", "susy"]
  console.log("totalScore:", totalScore); // 71
}

/*
Alternative (for reference only, not required by the prompt):

const usernamesAlt = gameInfo.map(p => p.username + "!");
const winnersAlt = gameInfo.filter(p => p.score > 5).map(p => p.username);
const totalAlt = gameInfo.reduce((sum, p) => sum + p.score, 0);
*/
