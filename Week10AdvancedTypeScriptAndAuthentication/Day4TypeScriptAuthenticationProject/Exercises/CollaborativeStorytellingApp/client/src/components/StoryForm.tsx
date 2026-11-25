import { useState, type FormEvent } from "react";

interface StoryFormProps {
  onCreate: (title: string, content: string) => Promise<void>;
}

export default function StoryForm({ onCreate }: StoryFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onCreate(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>Start a story</h2>
      <input
        value={title}
        onChange={event => setTitle(event.target.value)}
        placeholder="Title"
        aria-label="Title"
      />
      <textarea
        value={content}
        onChange={event => setContent(event.target.value)}
        placeholder="Once upon a time…"
        aria-label="First lines"
      />
      <button type="submit">Publish</button>
    </form>
  );
}
