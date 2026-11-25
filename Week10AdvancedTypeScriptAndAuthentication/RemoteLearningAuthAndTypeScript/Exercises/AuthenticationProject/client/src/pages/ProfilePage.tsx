import { useState, type FormEvent } from "react";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [message, setMessage] = useState("");

  if (!user || !token) return null; // RequireAuth makes sure this doesn't happen

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { user: updated } = await api.updateProfile(token, { name, bio });
      setUser(updated);
      setMessage("Profile saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not save");
    }
  };

  return (
    <section className="card">
      <h2>Hello, {user.name}</h2>
      <p className="muted">
        {user.email} · member since {new Date(user.joinedAt).toLocaleDateString()}
      </p>
      <form className="stack" onSubmit={handleSubmit}>
        <label className="stack">
          Name
          <input value={name} onChange={event => setName(event.target.value)} />
        </label>
        <label className="stack">
          Bio (280 characters max)
          <textarea value={bio} maxLength={280} onChange={event => setBio(event.target.value)} />
        </label>
        <button type="submit">Save profile</button>
        {message && <p aria-live="polite">{message}</p>}
      </form>
    </section>
  );
}
