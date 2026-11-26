import { useEffect, useState } from "react";
import { chooseMove, isDraw, newBoard, nextPlayer, playMove, winner, winningLine } from "./game.js";
import "./style.css";

export default function App() {
  const [board, setBoard] = useState(newBoard);
  const [mode, setMode] = useState("human");
  const turn = nextPlayer(board),
    result = winner(board),
    draw = isDraw(board);
  const line = winningLine(board);
  const computerTurn = mode === "computer" && turn === "O" && !result && !draw;
  useEffect(() => {
    if (!computerTurn) return;
    const timer = setTimeout(() => {
      setBoard(current =>
        current === board ? playMove(current, chooseMove(current), "O") : current
      );
    }, 180);
    return () => clearTimeout(timer);
  }, [board, computerTurn]);

  return (
    <main>
      <h1>Tic Tac Toe</h1>
      <fieldset className="modes">
        <legend>Play mode</legend>
        {[
          ["human", "Two players"],
          ["computer", "Against the computer"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            aria-controls="game-board"
            onClick={() => {
              // Re-selecting the active mode must not erase an ongoing round.
              if (mode === value) return;
              setMode(value);
              setBoard(newBoard());
            }}
          >
            {label}
          </button>
        ))}
      </fieldset>
      <p role="status" aria-live="polite">
        {result
          ? result + " wins!"
          : draw
            ? "Draw. Try another round."
            : computerTurn
              ? "Computer is choosing..."
              : turn + "'s turn"}
      </p>
      <section id="game-board" className="board" aria-label="Tic Tac Toe board">
        {board.map((value, index) => (
          <button
            key={index}
            type="button"
            className={line?.includes(index) ? "winning" : ""}
            aria-label={
              "Row " +
              (Math.floor(index / 3) + 1) +
              ", column " +
              ((index % 3) + 1) +
              ": " +
              (value ?? "empty")
            }
            disabled={Boolean(value || result || draw || computerTurn)}
            onClick={() => setBoard(current => playMove(current, index))}
          >
            {value ?? ""}
          </button>
        ))}
      </section>
      <button type="button" className="reset" onClick={() => setBoard(newBoard())}>
        Reset game
      </button>
      <p className="note">
        {mode === "computer"
          ? "You play X. The computer plays O."
          : "X and O take turns on this device."}
      </p>
    </main>
  );
}
