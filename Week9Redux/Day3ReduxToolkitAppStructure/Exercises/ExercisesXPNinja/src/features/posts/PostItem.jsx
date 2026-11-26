import { useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice.js";
import { postRemoved, postUpdated } from "./postsSlice.js";

export default function PostItem({ post }) {
  const author = useSelector(state => selectUserById(state, post.userId));
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);
  const [error, setError] = useState("");
  const input = useRef(null);
  const errorId = useId();

  const save = () => {
    // An invalid Save keeps the editor and draft available for correction.
    if (!draft.trim()) {
      setError("Enter post text with at least one non-space character.");
      input.current?.focus();
      return;
    }
    dispatch(postUpdated({ id: post.id, text: draft.trim() }));
    setError("");
    setIsEditing(false);
  };

  return (
    <li>
      <span>
        <strong>{author?.name ?? "Unknown"}:</strong>{" "}
        {isEditing ? (
          <input
            ref={input}
            value={draft}
            onChange={event => {
              setDraft(event.target.value);
              if (event.target.value.trim()) setError("");
            }}
            aria-label="Edit post"
            dir="auto"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby={error ? errorId : undefined}
          />
        ) : (
          post.text
        )}
        {error && (
          <span className="error edit-error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </span>
      <span className="row">
        {isEditing ? (
          <button onClick={save}>Save</button>
        ) : (
          <button className="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button className="danger" onClick={() => dispatch(postRemoved(post.id))}>
          Delete
        </button>
      </span>
    </li>
  );
}
