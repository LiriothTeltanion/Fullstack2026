import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories, selectSelectedCategoryId } from "../categories/categoriesSlice.js";
import TaskItem from "./TaskItem.jsx";
import {
  selectCompletedCount,
  selectVisibleTasks,
  taskAdded,
  taskDeleted,
  taskEdited,
  taskToggled,
} from "./tasksSlice.js";

export default function TaskList() {
  const tasks = useSelector(selectVisibleTasks);
  const completed = useSelector(selectCompletedCount);
  const categories = useSelector(selectCategories);
  const selectedId = useSelector(selectSelectedCategoryId);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");

  // useCallback keeps the same function between renders, so memo(TaskItem) can skip work.
  const handleToggle = useCallback(id => dispatch(taskToggled(id)), [dispatch]);
  const handleDelete = useCallback(id => dispatch(taskDeleted(id)), [dispatch]);
  const handleEdit = useCallback(
    task => {
      const newTitle = window.prompt("Edit task", task.title);
      if (newTitle && newTitle.trim())
        dispatch(taskEdited({ id: task.id, title: newTitle.trim() }));
    },
    [dispatch]
  );

  const handleSubmit = event => {
    event.preventDefault();
    const target = selectedId === "all" ? categoryId : selectedId;
    if (!title.trim() || !target) return;
    dispatch(taskAdded(title.trim(), target));
    setTitle("");
  };

  const nameOf = id => categories.find(category => category.id === id)?.name ?? "?";

  return (
    <section className="card">
      <h2>
        Tasks ({completed}/{tasks.length} done)
      </h2>
      <form className="row" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="New task"
          aria-label="New task"
        />
        {selectedId === "all" && (
          <select
            value={categoryId}
            onChange={event => setCategoryId(event.target.value)}
            aria-label="Category"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        <button type="submit">Add task</button>
      </form>
      <ul className="plain">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            categoryName={nameOf(task.categoryId)}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </section>
  );
}
