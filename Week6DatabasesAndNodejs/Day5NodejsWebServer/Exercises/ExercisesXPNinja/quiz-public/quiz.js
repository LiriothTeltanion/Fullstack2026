/* global document */
const elements = Object.fromEntries(
  [
    "quiz",
    "error",
    "progress",
    "score",
    "answer-form",
    "choices",
    "question",
    "submit",
    "feedback",
    "next",
    "result",
    "restart",
  ].map(id => [id, document.getElementById(id)])
);
let currentState = null;
let busy = false;

async function api(path = "", body) {
  const response = await fetch("/api/quiz" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "The request failed. Please retry.");
  return data;
}

function render(state, focus = false) {
  currentState = state;
  elements.error.hidden = true;
  elements.score.textContent = "Score: " + state.score + " / " + state.total;
  elements.progress.textContent = state.complete
    ? "Quiz complete"
    : "Question " + state.number + " of " + state.total;
  elements["answer-form"].hidden = state.complete;
  elements.result.hidden = !state.complete;
  elements.result.textContent = state.complete
    ? "Final score: " + state.score + " / " + state.total
    : "";
  elements.restart.textContent = "Restart quiz";
  elements.next.hidden = !state.feedback || state.complete;
  elements.next.textContent = state.number === state.total ? "Show results" : "Next question";
  elements.feedback.hidden = !state.feedback;
  elements.feedback.textContent = state.feedback
    ? (state.feedback.correct ? "Correct. " : "Incorrect. ") + state.feedback.explanation
    : "";
  elements.feedback.className = state.feedback
    ? state.feedback.correct
      ? "correct"
      : "incorrect"
    : "";
  elements.choices.replaceChildren(elements.question);
  if (state.question) {
    elements.question.textContent = state.question.prompt;
    for (const choice of state.question.choices) {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "choice";
      input.value = choice.id;
      input.checked = choice.id === state.feedback?.choiceId;
      input.disabled = Boolean(state.feedback);
      input.addEventListener("change", () => {
        elements.submit.disabled = false;
      });
      label.append(input, document.createTextNode(choice.label));
      elements.choices.append(label);
    }
  }
  elements.submit.disabled = true;
  if (focus)
    (state.complete
      ? elements.result
      : state.feedback
        ? elements.feedback
        : elements.question
    ).focus();
}

async function act(operation) {
  if (busy) return;
  busy = true;
  elements.quiz.setAttribute("aria-busy", "true");
  // Keep existing selection on failure so the same answer can be retried safely.
  const selected = elements["answer-form"].querySelector("input:checked");
  elements.submit.disabled = true;
  elements.next.disabled = true;
  elements.restart.disabled = true;
  try {
    render(await operation(), true);
  } catch (error) {
    elements.error.textContent = error.message + " You can retry or start a new quiz.";
    elements.error.hidden = false;
    elements.submit.disabled = !selected || Boolean(currentState?.feedback);
  } finally {
    busy = false;
    elements.quiz.setAttribute("aria-busy", "false");
    elements.next.disabled = false;
    elements.restart.disabled = false;
  }
}

elements.restart.addEventListener("click", () => act(() => api("", {})));
elements["answer-form"].addEventListener("submit", event => {
  event.preventDefault();
  const selected = elements["answer-form"].querySelector("input:checked");
  if (!selected || !currentState?.question) return;
  act(() => api("/answers", { questionId: currentState.question.id, choiceId: selected.value }));
});
elements.next.addEventListener("click", () => {
  if (currentState?.question) act(() => api("/next", { questionId: currentState.question.id }));
});

// Reloading resumes the same anonymous session, including its last feedback.
// Wait for this initial read before permitting Start, avoiding an out-of-order render.
elements.restart.disabled = true;
api()
  .then(state => render(state))
  .catch(error => {
    if (!error.message.startsWith("No active quiz.")) {
      elements.error.textContent = error.message + " Start a new quiz to retry.";
      elements.error.hidden = false;
    }
  })
  .finally(() => {
    elements.restart.disabled = false;
  });
