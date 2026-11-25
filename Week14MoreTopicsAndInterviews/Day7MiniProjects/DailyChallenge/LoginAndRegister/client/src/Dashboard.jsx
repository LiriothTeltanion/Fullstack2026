export default function Dashboard({ user, onSignOut }) {
  return (
    <section className="account-card">
      <h1>Welcome, {user.name}</h1>
      <dl>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Joined</dt>
        <dd>{user.joined}</dd>
      </dl>
      <button onClick={onSignOut}>Sign out</button>
    </section>
  );
}
