import { Component } from "react";
import { Link } from "react-router-dom";
import { getPostsByUser, getUser, isValidUserId } from "../api.js";

/** Load user details and posts together without allowing an older route to win a race. */
export default class PostList extends Component {
  state = { user: null, posts: [], loading: true, error: "" };
  requestVersion = 0;
  mounted = false;
  controller = null;

  componentDidMount() {
    this.mounted = true;
    this.loadPosts();
  }

  componentDidUpdate(previousProps) {
    if (previousProps.userId !== this.props.userId) this.loadPosts();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.requestVersion += 1;
    this.controller?.abort();
  }

  loadPosts = async () => {
    this.controller?.abort();
    const version = ++this.requestVersion;
    this.controller = new AbortController();
    this.setState({ user: null, posts: [], loading: true, error: "" });
    if (!isValidUserId(this.props.userId)) {
      this.setState({ loading: false, error: "Choose a valid user number." });
      return;
    }
    try {
      const options = { signal: this.controller.signal };
      const [user, posts] = await Promise.all([
        getUser(this.props.userId, options),
        getPostsByUser(this.props.userId, options),
      ]);
      if (this.mounted && version === this.requestVersion) {
        this.setState({ user, posts, loading: false });
      }
    } catch (error) {
      if (this.mounted && version === this.requestVersion && error.name !== "AbortError") {
        this.setState({ loading: false, error: error.message });
      }
    }
  };

  render() {
    const { user, posts, loading, error } = this.state;
    return (
      <div>
        <Link to="/">← All users</Link>
        {loading ? (
          <p role="status">Loading posts…</p>
        ) : error ? (
          <div>
            <p className="error" role="alert">
              {error}
            </p>
            {isValidUserId(this.props.userId) && (
              <button type="button" onClick={this.loadPosts}>
                Retry posts
              </button>
            )}
          </div>
        ) : user ? (
          <>
            <h2>{user.name}</h2>
            <p className="muted">
              {user.email || "Email unavailable"} · {user.address?.city || "City unavailable"}
            </p>
            <h3>{posts.length} posts</h3>
            {!posts.length && <p role="status">This user has no posts yet.</p>}
            {posts.map(post => (
              <article key={post.id} className="card">
                <h4>{post.title}</h4>
                <p>{post.body}</p>
              </article>
            ))}
          </>
        ) : null}
      </div>
    );
  }
}
