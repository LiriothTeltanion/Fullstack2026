// Shown only when /api/users/me answered with a user
export default function Profile({ user, onLogout }) {
  const joined = new Date(user.created_at).toLocaleDateString("en-GB");

  return (
    <section className="card">
      <h2>Hello, {user.username}</h2>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        {user.created_at && (
          <>
            <dt>Member since</dt>
            <dd>{joined}</dd>
          </>
        )}
      </dl>
      <p className="muted">
        This page came from a protected route. Without a valid token the server says 401.
      </p>
      <button type="button" onClick={onLogout}>
        Log out
      </button>
    </section>
  );
}
