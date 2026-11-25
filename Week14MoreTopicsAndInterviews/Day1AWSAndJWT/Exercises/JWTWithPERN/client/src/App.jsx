import { useEffect, useState } from "react";
import { api } from "./api.js";
import AuthForm from "./components/AuthForm.jsx";
import Profile from "./components/Profile.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // On page load, ask the server who we are. A valid cookie means we're still logged in.
  useEffect(() => {
    api("/users/me")
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  async function handleLogout() {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
  }

  return (
    <main className="app">
      <h1>JWT with PERN</h1>
      {checking ? (
        <p className="muted">Checking your session…</p>
      ) : user ? (
        <Profile user={user} onLogout={handleLogout} />
      ) : (
        <AuthForm onAuth={setUser} />
      )}
    </main>
  );
}
