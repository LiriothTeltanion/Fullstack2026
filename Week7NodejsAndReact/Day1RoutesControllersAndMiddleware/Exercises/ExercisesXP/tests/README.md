# Controller tests

From the exercise directory, run `npm test`. The six cases use Node's built-in test runner and fresh in-memory data for each case.

Try predicting what should happen when a todo update supplies a new title and the string `"false"` for `completed`. The regression test checks both the response and the original record so a rejected request cannot silently rename the todo.
