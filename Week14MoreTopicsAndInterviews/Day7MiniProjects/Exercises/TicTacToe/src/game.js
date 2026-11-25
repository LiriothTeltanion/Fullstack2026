// The same eight winning lines checked by the Week 1 Python game, flattened for React.
export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export const newBoard = () => Array(9).fill(null);

export function winningLine(board) {
  return (
    WINNING_LINES.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]) ??
    null
  );
}
export function winner(board) {
  const line = winningLine(board);
  return line ? board[line[0]] : null;
}
export function isDraw(board) {
  return board.every(Boolean) && !winner(board);
}
export function nextPlayer(board) {
  return board.filter(Boolean).length % 2 === 0 ? "X" : "O";
}
export function playMove(board, index, player = nextPlayer(board)) {
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index > 8 ||
    board[index] ||
    winner(board) ||
    isDraw(board)
  )
    return board;
  const next = [...board];
  next[index] = player;
  return next;
}

const preference = [4, 0, 2, 6, 8, 1, 3, 5, 7];
function evaluate(board, turn, computer) {
  const result = winner(board);
  if (result) return result === computer ? 1 : -1;
  if (isDraw(board)) return 0;
  const scores = preference
    .filter(index => !board[index])
    .map(index => evaluate(playMove(board, index, turn), turn === "X" ? "O" : "X", computer));
  return turn === computer ? Math.max(...scores) : Math.min(...scores);
}
export function chooseMove(board, computer = "O") {
  if (winner(board) || isDraw(board)) return -1;
  let best = -Infinity,
    move = -1;
  for (const index of preference) {
    if (board[index]) continue;
    const score = evaluate(
      playMove(board, index, computer),
      computer === "X" ? "O" : "X",
      computer
    );
    if (score > best) {
      best = score;
      move = index;
    }
  }
  return move;
}
