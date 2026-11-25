import { useState, type FormEvent } from "react";
import type { Story } from "../types";
interface StoryFormProps {
  onCreate: (title: string, content: string) => Promise<boolean | void>;
  initialStory?: Pick<Story, "title" | "content">;
  heading?: string;
  submitLabel?: string;
  onCancel?: () => void;
}
export default function StoryForm({
  onCreate,
  initialStory,
  heading = "Start a story",
  submitLabel = "Publish",
  onCancel,
}: StoryFormProps) {
  const [title, setTitle] = useState(initialStory?.title ?? "");
  const [content, setContent] = useState(initialStory?.content ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Enter a title and some story text.");
      return;
    }
    setBusy(true);
    try {
      const saved = await onCreate(title.trim(), content.trim());
      // The parent reports mutation errors as false. Never erase an unsaved draft.
      if (saved !== false) {
        setTitle("");
        setContent("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this story.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card stack story-form" onSubmit={handleSubmit}>
      <h2 id="page-title" tabIndex={-1}>
        {heading}
      </h2>
      <label className="field">
        Title
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          required
          disabled={busy}
        />
      </label>
      <label className="field">
        Story text
        <textarea
          value={content}
          onChange={event => setContent(event.target.value)}
          placeholder="Once upon a time…"
          aria-label={initialStory ? "Story text" : "First lines"}
          required
          disabled={busy}
        />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="row">
        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
