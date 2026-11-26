// Original practice questions; the answer key stays on the server.
export const questions = [
  {
    id: "http",
    prompt: "A browser successfully retrieves a page. Which HTTP status fits?",
    choices: [
      { id: "a", label: "200 OK" },
      { id: "b", label: "404 Not Found" },
      { id: "c", label: "503 Service Unavailable" },
    ],
    correctChoiceId: "a",
    explanation: "200 OK indicates that the request succeeded.",
  },
  {
    id: "array",
    prompt: "Which JavaScript method creates a new array by transforming each item?",
    choices: [
      { id: "a", label: "push()" },
      { id: "b", label: "map()" },
      { id: "c", label: "pop()" },
    ],
    correctChoiceId: "b",
    explanation: "map() returns a new array containing the callback result for each item.",
  },
  {
    id: "label",
    prompt: "What connects a visible HTML label to its form input?",
    choices: [
      { id: "a", label: "Matching label for and input id values" },
      { id: "b", label: "Giving them the same text color" },
      { id: "c", label: "Placing a heading above the page" },
    ],
    correctChoiceId: "a",
    explanation: "The label's for attribute references the input's id.",
  },
  {
    id: "express",
    prompt: "Which Express response method sends a JavaScript value as JSON?",
    choices: [
      { id: "a", label: "res.listen()" },
      { id: "b", label: "res.route()" },
      { id: "c", label: "res.json()" },
    ],
    correctChoiceId: "c",
    explanation: "res.json() serializes the value and sets the JSON content type.",
  },
  {
    id: "memory",
    prompt: "What happens to an in-memory quiz session when its Node process restarts?",
    choices: [
      { id: "a", label: "It is automatically saved to a database" },
      { id: "b", label: "It is lost unless the application persists it" },
      { id: "c", label: "It moves into the browser's source files" },
    ],
    correctChoiceId: "b",
    explanation: "Process memory is temporary. This practice app deliberately uses no database.",
  },
];
