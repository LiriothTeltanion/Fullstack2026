import { Component } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../api.js";

/** The class lifecycle owns its request; leaving the route cancels that request. */
export default class UsersList extends Component {
  state = { users: [], loading: true, error: "" };
  requestVersion = 0;
  mounted = false;
  controller = null;

  componentDidMount() {
    this.mounted = true;
    this.loadUsers();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.requestVersion += 1;
    this.controller?.abort();
  }

  loadUsers = async () => {
    this.controller?.abort();
    this.controller = new AbortController();
    const version = ++this.requestVersion;
    this.setState({ users: [], loading: true, error: "" });
    try {
      const users = await getUsers({ signal: this.controller.signal });
      if (this.mounted && version === this.requestVersion) {
        this.setState({ users, loading: false });
      }
    } catch (error) {
      if (this.mounted && version === this.requestVersion && error.name !== "AbortError") {
        this.setState({ loading: false, error: error.message });
      }
    }
  };

  render() {
    const { users, loading, error } = this.state;
    if (loading) return <p role="status">Loading users…</p>;
    if (error) {
      return (
        <div>
          <p className="error" role="alert">
            {error}
          </p>
          <button type="button" onClick={this.loadUsers}>
            Retry users
          </button>
        </div>
      );
    }
    if (!users.length) return <p role="status">No users are available yet.</p>;
    return (
      <div className="grid" aria-label="Users">
        {users.map(user => (
          <Link key={user.id} to={`/users/${user.id}`} className="card user">
            <strong>{user.name}</strong>
            <span className="muted">@{user.username || "unknown"}</span>
            <span>{user.company?.name || "Company unavailable"}</span>
          </Link>
        ))}
      </div>
    );
  }
}
