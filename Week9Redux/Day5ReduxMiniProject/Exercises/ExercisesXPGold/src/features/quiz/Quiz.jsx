import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  QUESTION_COUNT,
  nextQuestion,
  optionChosen,
  restarted,
  selectCurrentAnswer,
  selectCurrentQuestion,
  selectScore,
  tick,
} from "./quizSlice.js";

export default function Quiz() {
  const { current, secondsLeft, finished } = useSelector(state => state.quiz);
  const question = useSelector(selectCurrentQuestion);
  const chosen = useSelector(selectCurrentAnswer);
  const score = useSelector(selectScore);
  const dispatch = useDispatch();
  const answered = chosen !== undefined;

  // One tick per second while the question is open.
  useEffect(() => {
    if (finished || answered) return undefined;
    const id = setInterval(() => dispatch(tick()), 1000);
    return () => clearInterval(id);
  }, [finished, answered, dispatch]);

  if (finished) {
    return (
      <section className="card">
        <h2>Done</h2>
        <p className="big">
          {score} / {QUESTION_COUNT}
        </p>
        <button onClick={() => dispatch(restarted())}>Play again</button>
      </section>
    );
  }

  const classFor = index => {
    if (!answered) return "secondary";
    if (index === question.answer) return "correct";
    return index === chosen ? "wrong" : "secondary";
  };

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="muted">
          Question {current + 1} of {QUESTION_COUNT}
        </span>
        <span aria-live="polite">{answered ? `Score: ${score}` : `${secondsLeft}s left`}</span>
      </div>
      <h2>{question.text}</h2>
      <div className="answers">
        {question.options.map((option, index) => (
          <button
            key={option}
            className={classFor(index)}
            onClick={() => dispatch(optionChosen(index))}
            disabled={answered}
          >
            {option}
          </button>
        ))}
      </div>
      {chosen === null && <p className="error">Time's up.</p>}
      {answered && (
        <p>
          <button onClick={() => dispatch(nextQuestion())}>
            {current === QUESTION_COUNT - 1 ? "See my score" : "Next question"}
          </button>
        </p>
      )}
    </section>
  );
}
