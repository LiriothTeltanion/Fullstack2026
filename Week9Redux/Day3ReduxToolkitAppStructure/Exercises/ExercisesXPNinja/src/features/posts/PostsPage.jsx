import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserFilter from "../users/UserFilter.jsx";
import PostItem from "./PostItem.jsx";
import { postAdded, selectPostsByUser } from "./postsSlice.js";

export default function PostsPage() {
  const [userId, setUserId] = useState("all");
  const [text, setText] = useState("");
  const posts = useSelector(state => selectPostsByUser(state, userId));
  const dispatch = useDispatch();

  const handleSubmit = event => {
    event.preventDefault();
    if (!text.trim() || userId === "all") return;
    dispatch(postAdded(userId, text.trim()));
    setText("");
  };

  return (
    <section className="card">
      <UserFilter selected={userId} onSelect={setUserId} />
      <form className="row" onSubmit={handleSubmit} style={{ marginTop: 12 }}>
        <input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder={userId === "all" ? "Pick a user to post as them" : "Write a post"}
          disabled={userId === "all"}
          aria-label="New post"
        />
        <button type="submit" disabled={userId === "all"}>
          Post
        </button>
      </form>
      <ul className="plain">
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </ul>
    </section>
  );
}
