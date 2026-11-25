// Talks to the /quiz API with fetch and updates the page.
const questionEl = document.querySelector("#question");
const progressEl = document.querySelector("#progress");
const feedbackEl = document.querySelector("#feedback");
const scoreEl = document.querySelector("#score");
const form = document.querySelector("#answer-form");
const input = document.querySelector("#answer");

async function loadQuestion() {
  const response = await fetch("/quiz");
  const data = await response.json();

  if (data.finished) {
    const scoreResponse = await fetch("/quiz/score");
    const score = await scoreResponse.json();
    questionEl.textContent = "Game over!";
    progressEl.textContent = "";
    scoreEl.textContent = `Final score: ${score.score} / ${score.total}`;
    form.hidden = true;
    return;
  }

  form.hidden = false;
  progressEl.textContent = `Question ${data.number} of ${data.total}`;
  questionEl.textContent = data.question;
  input.value = "";
  input.focus();
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const response = await fetch("/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: input.value }),
  });
  const result = await response.json();

  if (!response.ok) {
    feedbackEl.textContent = result.error;
    return;
  }
  feedbackEl.className = result.correct ? "correct" : "wrong";
  feedbackEl.textContent = result.correct
    ? "Correct!"
    : `Not quite, the answer was ${result.correctAnswer}.`;
  scoreEl.textContent = `Score: ${result.score}`;
  loadQuestion();
});

document.querySelector("#reset").addEventListener("click", async () => {
  await fetch("/quiz/reset", { method: "POST" });
  feedbackEl.textContent = "";
  scoreEl.textContent = "";
  loadQuestion();
});

loadQuestion();
