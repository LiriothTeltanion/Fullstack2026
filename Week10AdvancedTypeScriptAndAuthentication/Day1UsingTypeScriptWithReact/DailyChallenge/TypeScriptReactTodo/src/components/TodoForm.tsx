import { useState, type FormEvent } from "react";
import type { Priority } from "../types";

interface TodoFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

const PRIORITIES: Priority[] = ["low", "medium", "high"];

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!text.trim()) return;
    onAdd(text.trim(), priority);
    setText("");
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={event => setText(event.target.value)}
        placeholder="What needs doing?"
        aria-label="New todo"
      />
      <select
        value={priority}
        onChange={event => setPriority(event.target.value as Priority)}
        aria-label="Priority"
      >
        {PRIORITIES.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}
