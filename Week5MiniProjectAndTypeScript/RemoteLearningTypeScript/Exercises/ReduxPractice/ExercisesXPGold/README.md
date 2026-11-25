# 🥇 Remote TypeScript · Todo list

![Folder animation](../../../../../assets/readme/folder-pulse.svg)

A typed Redux Toolkit todo list with due dates, completion, deletion and browser persistence. The shared setup lives one folder above, alongside the Ninja exercise.

## Run 🚀

From this folder:

```bash
npm --prefix .. ci
npm --prefix .. run dev
```

Open [Gold tasks](http://127.0.0.1:5404/#/gold). The companion [Ninja profile](http://127.0.0.1:5404/#/ninja/login) uses the same Vite app and lockfile.

```bash
npm --prefix .. test
npm --prefix .. run build
```

## What is implemented 🧩

- src/todoSlice.ts models id, title, completed, dueDate and createdAt.
- src/AddTodo.tsx validates a title and calendar date and reads the submitted native form values through FormData.
- src/TodoList.tsx supports all, completed, incomplete and overdue views.
- Overdue means an incomplete task whose due date is before today's local calendar date.
- Completed and overdue cards use text and color, with labelled checkboxes and delete controls.
- The shared store saves only tasks under fullstack-remote-todos-v1. Authentication is not persisted.

Saved data is versioned and validated. Invalid entries, duplicate IDs and impossible calendar dates are discarded. Malformed JSON or an unsupported envelope produces an empty list and visible warning. A storage/quota error retains tasks in memory and displays a warning. Task titles are limited to 200 characters and hydration is capped at 500 items.

## Verification 🧪

The shared DOM test covers empty input, native date changes without a React change event, adding, toggling, deleting, the four filters, highlights, reload persistence and storage failures. The production build includes strict TypeScript checking.

The implementation is local practice, with no task server or synchronization. Reloading another tab is required to reread changes made elsewhere.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
