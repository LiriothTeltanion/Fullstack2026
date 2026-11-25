# 💪 Daily Challenge - Todo List

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/todo-list-1254c9044b.svg" width="100%" alt="Progress card for Todo List">

</div>

A to-do list in a single HTML file: add a task, tick it as done, or delete it.

## ▶️ How to run

Open `todo_list.html` in a browser (or run `npm run dev` from the repo root and open it at `http://localhost:8000/`). The delete icon comes from Font Awesome on a CDN, so it needs internet.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `addTask(text)` | Trims the text, alerts `Please enter a task.` when it is empty, otherwise stores `{ task_id, text, done: false }` in the `tasks` array and shows it. |
| `renderTask(task)` | Builds a row with a checkbox, a label and a delete button, and puts it at the top of the list. |
| `doneTask(taskId, checked)` | Updates `done` and toggles the `done` class, which crosses the task out in red. |
| `deleteTask(taskId)` | Removes the task from the array and its row from the page. |

The list uses one `click` and one `change` listener for every row (event delegation), and `Escape` clears the input.

## 🧠 What I learned

- Keeping each task as an object with an id makes it easy to find it again
- `data-task-id` links a row on the page to its object in the array
- Event delegation means new rows work without adding new listeners
- `prepend()` puts the newest task first

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 5 - Mini-projects - Daily Challenge
