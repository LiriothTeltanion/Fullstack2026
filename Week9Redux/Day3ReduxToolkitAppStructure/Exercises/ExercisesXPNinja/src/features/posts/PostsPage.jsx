import { useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserFilter from "../users/UserFilter.jsx";
import PostItem from "./PostItem.jsx";
import { postAdded, selectPostsByUser } from "./postsSlice.js";

export default function PostsPage() {
  const [userId, setUserId] = useState("all");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const input = useRef(null);
  const inputId = useId();
  const posts = useSelector(state => selectPostsByUser(state, userId));
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    if (userId === "all") return;
    if (!text.trim()) {
      setError("Enter a post with at least one non-space character.");
      input.current?.focus();
      return;
    }
    dispatch(postAdded(userId, text.trim()));
    setText("");
    setError("");
  };

  return (
    <section className="card">
      <UserFilter
        selected={userId}
        onSelect={value => {
          setUserId(value);
          setError("");
        }}
      />
      <form className="row" onSubmit={handleSubmit} style={{ marginTop: 12 }} noValidate>
        <input
          ref={input}
          value={text}
          onChange={event => {
            setText(event.target.value);
            if (event.target.value.trim()) setError("");
          }}
          placeholder={userId === "all" ? "Pick a user to post as them" : "Write a post"}
          disabled={userId === "all"}
          aria-label="New post"
          dir="auto"
          required
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        <button type="submit" disabled={userId === "all"}>
          Post
        </button>
        {error && (
          <p className="error post-error" id={`${inputId}-error`} role="alert">
            {error}
          </p>
        )}
      </form>
      <ul className="plain">
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}
