import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { api } from "../api";
import type { StoryComment, User } from "../types";
import "./StoryComments.css";

interface DiscussionProps {
  storyId: number;
  currentUser: User;
  storyAuthorId: number;
}

// Changing either identity remounts drafts and pending operations. A delayed response
// from a previous story/account must never become part of the new discussion.
export default function StoryComments(props: DiscussionProps) {
  return <Discussion key={`${props.storyId}:${props.currentUser.id}`} {...props} />;
}

function CommentItem({
  comment,
  currentUser,
  storyAuthorId,
  onChange,
  onRemove,
  capabilities,
}: {
  comment: StoryComment;
  currentUser: User;
  storyAuthorId: number;
  capabilities: { edit: boolean; delete: boolean };
  onChange: (comment: StoryComment) => void;
  onRemove: (id: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [draft, setDraft] = useState(comment.body);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);
  const editButton = useRef<HTMLButtonElement>(null);
  const deleteButton = useRef<HTMLButtonElement>(null);
  const editId = useId();
  const own = comment.author.id === currentUser.id;
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { comment: updated } = await api.updateComment(
        comment.storyId,
        comment.id,
        draft.trim()
      );
      if (!alive.current) return;
      onChange(updated);
      setEditing(false);
      requestAnimationFrame(() => editButton.current?.focus());
    } catch (reason) {
      if (alive.current)
        setError(reason instanceof Error ? reason.message : "Could not save comment.");
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  async function remove() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api.deleteComment(comment.storyId, comment.id);
      if (alive.current) onRemove(comment.id);
    } catch (reason) {
      if (alive.current)
        setError(reason instanceof Error ? reason.message : "Could not delete comment.");
    } finally {
      if (alive.current) setBusy(false);
    }
  }

  return (
    <li>
      <strong>{comment.author.username}</strong>{" "}
      <time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleString()}</time>
      {editing ? (
        <form className="stack" onSubmit={save}>
          <label htmlFor={editId}>Edit your comment</label>
          <textarea
            id={editId}
            value={draft}
            required
            disabled={busy}
            autoFocus
            onChange={event => setDraft(event.target.value)}
          />
          <div className="row">
            <button type="submit" disabled={busy || !draft.trim()}>
              {busy ? "Saving…" : "Save comment"}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setError("");
                requestAnimationFrame(() => editButton.current?.focus());
              }}
            >
              Cancel edit
            </button>
          </div>
        </form>
      ) : (
        <p>{comment.body}</p>
      )}
      {!editing && (
        <div className="row comment-actions">
          {own && capabilities.edit && (
            <button
              type="button"
              className="secondary"
              ref={editButton}
              disabled={busy || confirming}
              onClick={() => {
                setDraft(comment.body);
                setEditing(true);
                setError("");
              }}
            >
              Edit comment
            </button>
          )}
          {capabilities.delete && (own || storyAuthorId === currentUser.id) && (
            <button
              type="button"
              className="secondary"
              ref={deleteButton}
              disabled={busy || confirming}
              onClick={() => {
                setConfirming(true);
                setError("");
              }}
            >
              Delete comment
            </button>
          )}
        </div>
      )}
      {confirming && (
        <div className="stack">
          <p>Delete this comment permanently?</p>
          <div className="row">
            <button type="button" className="danger" disabled={busy} onClick={remove}>
              {busy ? "Deleting…" : "Confirm delete comment"}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                setError("");
                requestAnimationFrame(() => deleteButton.current?.focus());
              }}
            >
              Keep comment
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </li>
  );
}

function Discussion({ storyId, currentUser, storyAuthorId }: DiscussionProps) {
  const headingId = useId();
  const inputId = useId();
  const [capabilities, setCapabilities] = useState({ edit: false, delete: false });
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const alive = useRef(true);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");
    Promise.all([
      api.comments(storyId),
      api.commentCapabilities().catch(() => ({ edit: false, delete: false })),
    ])
      .then(([{ comments }, available]) => {
        if (active) {
          setComments(comments);
          setCapabilities(available);
        }
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
      if (!alive.current) return;
      setComments(previous => [...previous, comment]);
      setDraft("");
      setAnnouncement("Comment added.");
      requestAnimationFrame(() => input.current?.focus());
    } catch (error) {
      if (alive.current)
        setPostError(error instanceof Error ? error.message : "Could not post your comment.");
    } finally {
      if (alive.current) setPosting(false);
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
          {(!capabilities.edit || !capabilities.delete) && (
            <p className="muted">
              Some comment actions are unavailable right now. You can still read and post comments.
            </p>
          )}
          {comments.length === 0 ? (
            <p className="muted">No comments yet.</p>
          ) : (
            <ol className="story-comments-list">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  capabilities={capabilities}
                  currentUser={currentUser}
                  storyAuthorId={storyAuthorId}
                  onChange={updated => {
                    setComments(previous =>
                      previous.map(item => (item.id === updated.id ? updated : item))
                    );
                    setAnnouncement("Comment saved.");
                  }}
                  onRemove={id => {
                    setComments(previous => previous.filter(item => item.id !== id));
                    setAnnouncement("Comment deleted.");
                    input.current?.focus();
                  }}
                />
              ))}
            </ol>
          )}
          <form className="stack" onSubmit={post}>
            <label htmlFor={inputId}>Add a comment</label>
            <textarea
              id={inputId}
              ref={input}
              value={draft}
              required
              disabled={posting}
              onChange={event => setDraft(event.target.value)}
            />
            <small>1–2000 characters. Your draft stays here if saving fails.</small>
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
        </>
      )}
      <span role="status">{announcement}</span>
    </section>
  );
}
