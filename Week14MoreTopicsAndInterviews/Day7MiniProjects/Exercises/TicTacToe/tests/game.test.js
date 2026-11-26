import test from "node:test";
import assert from "node:assert/strict";
import {
  WINNING_LINES,
  newBoard,
  playMove,
  nextPlayer,
  winner,
  winningLine,
  isDraw,
  chooseMove,
} from "../src/game.js";

test("a new board alternates players without mutating the previous board", () => {
  const original = newBoard();
  const first = playMove(original, 0);
  assert.deepEqual(original, Array(9).fill(null));
  assert.equal(first[0], "X");
  assert.equal(nextPlayer(first), "O");
  assert.equal(playMove(first, 1)[1], "O");
});
test("all eight lines detect a winner and expose the highlighted cells", () => {
  for (const line of WINNING_LINES) {
    const board = newBoard();
    line.forEach(index => (board[index] = "X"));
    assert.equal(winner(board), "X");
    assert.deepEqual(winningLine(board), line);
  }
});
test("occupied, invalid and finished cells reject further moves", () => {
  const board = ["X", "X", "X", "O", "O", null, null, null, null];
  for (const index of [-1, 9, 1.5, 3, 5]) assert.equal(playMove(board, index), board);
  const active = playMove(newBoard(), 0);
  assert.equal(playMove(active, 0), active);
});
test("a draw is different from a win and gives the computer no move", () => {
  const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  assert.equal(isDraw(board), true);
  assert.equal(winner(board), null);
  assert.equal(chooseMove(board), -1);
  assert.equal(playMove(board, 2), board);
});
test("computer takes a winning move and blocks a one-move loss", () => {
  assert.equal(chooseMove(["O", "O", null, "X", "X", null, "X", null, null]), 2);
  assert.equal(chooseMove(["X", "X", null, null, "O", null, null, null, null]), 2);
});
test("computer never loses to any sequence of legal human moves", () => {
  const visited = new Set();
  function explore(board) {
    const key = board.map(value => value || "-").join("");
    if (visited.has(key)) return;
    visited.add(key);
    assert.notEqual(winner(board), "X");
    if (winner(board) || isDraw(board)) return;
    if (nextPlayer(board) === "O") {
      const index = chooseMove(board);
      assert.equal(board[index], null);
      explore(playMove(board, index));
    } else
      board.forEach((value, index) => {
        if (!value) explore(playMove(board, index));
      });
  }
  explore(newBoard());
  assert.ok(visited.size > 100);
});
