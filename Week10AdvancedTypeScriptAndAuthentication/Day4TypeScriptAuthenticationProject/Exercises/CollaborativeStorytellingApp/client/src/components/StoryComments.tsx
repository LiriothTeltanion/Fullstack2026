import { useEffect, useId, useState, type FormEvent } from "react";
import { api } from "../api";
import type { StoryComment } from "../types";
import "./StoryComments.css";

export default function StoryComments({ storyId }: { storyId: number }) {
  const headingId = useId();
  const inputId = useId();
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    api
      .comments(storyId)
      .then(({ comments }) => {
        if (active) setComments(comments);
      })
      .catch((error: unknown) => {
        if (active)
          setLoadError(error instanceof Error ? error.message : "Could not load comments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [storyId, attempt]);

  async function post(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || posting) return;
    setPosting(true);
    setPostError("");
    setAnnouncement("");
    try {
      const { comment } = await api.addComment(storyId, body);
      setComments(previous => [...previous, comment]);
      setDraft("");
      setAnnouncement("Comment added.");
    } catch (error) {
      setPostError(error instanceof Error ? error.message : "Could not post your comment.");
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="story-comments" aria-labelledby={headingId}>
      <h3 id={headingId}>Comments</h3>
      {loading && <p role="status">Loading comments…</p>}
      {loadError && (
        <div>
          <p role="alert" className="error">
            {loadError}
          </p>
          <button type="button" className="secondary" onClick={() => setAttempt(n => n + 1)}>
            Retry loading comments
          </button>
        </div>
      )}
      {!loading && !loadError && (
        <>
          {comments.length === 0 ? (
            <p className="muted">No comments yet.</p>
          ) : (
            <ol className="story-comments-list">
              {comments.map(comment => (
                <li key={comment.id}>
                  <strong>{comment.author.username}</strong>{" "}
                  <time dateTime={comment.createdAt}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                  <p>{comment.body}</p>
                </li>
              ))}
            </ol>
          )}
          <form className="stack" onSubmit={post}>
            <label htmlFor={inputId}>Add a comment</label>
            <textarea
              id={inputId}
              value={draft}
              maxLength={2000}
              required
              disabled={posting}
              onChange={event => setDraft(event.target.value)}
            />
            {postError && (
              <p role="alert" className="error">
                {postError}
              </p>
            )}
            <div>
              <button type="submit" disabled={posting || !draft.trim()}>
                {posting ? "Posting…" : "Post comment"}
              </button>
            </div>
          </form>
          <span role="status">{announcement}</span>
        </>
      )}
    </section>
  );
}
