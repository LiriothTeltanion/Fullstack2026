import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice.js";
import { postRemoved, postUpdated } from "./postsSlice.js";

export default function PostItem({ post }) {
  const author = useSelector(state => selectUserById(state, post.userId));
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(post.text);

  const save = () => {
    if (draft.trim()) dispatch(postUpdated({ id: post.id, text: draft.trim() }));
    setIsEditing(false);
  };

  return (
    <li>
      <span>
        <strong>{author?.name ?? "Unknown"}:</strong>{" "}
        {isEditing ? (
          <input
            value={draft}
            onChange={event => setDraft(event.target.value)}
            aria-label="Edit post"
          />
        ) : (
          post.text
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
