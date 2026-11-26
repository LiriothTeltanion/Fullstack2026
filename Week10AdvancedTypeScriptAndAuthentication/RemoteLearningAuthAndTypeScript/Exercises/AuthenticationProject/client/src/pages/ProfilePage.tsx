import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { api } from "../api";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const edits = useRef({ name: 0, bio: 0 });
  const nameInput = useRef<HTMLInputElement>(null);
  const nameErrorId = useId();

  if (!user || !token) return null; // RequireAuth makes sure this doesn't happen

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current) return;
    setMessage("");
    if (!name.trim()) {
      setNameError("Enter a name with at least one non-space character.");
      nameInput.current?.focus();
      return;
    }
    setNameError("");
    const submitted = { ...edits.current };
    pending.current = true;
    setBusy(true);
    try {
      const { user: updated } = await api.updateProfile(token, { name, bio });
      if (!mounted.current || !setUser(updated, token)) return;
      // Normalize only fields that have not been edited since this request began.
      setName(current => (edits.current.name === submitted.name ? updated.name : current));
      setBio(current => (edits.current.bio === submitted.bio ? updated.bio : current));
      const hasNewEdits =
        edits.current.name !== submitted.name || edits.current.bio !== submitted.bio;
      setMessage(
        hasNewEdits
          ? "Submitted values saved. Your newer edits are not saved yet."
          : "Profile saved."
      );
    } catch (err) {
      if (mounted.current) setMessage(err instanceof Error ? err.message : "Could not save");
    } finally {
      if (mounted.current) {
        pending.current = false;
        setBusy(false);
      }
    }
  };

  return (
    <section className="card">
      <h2>Hello, {user.name}</h2>
      <p className="muted">
        {user.email} · member since {new Date(user.joinedAt).toLocaleDateString()}
      </p>
      <form className="stack" onSubmit={handleSubmit} noValidate>
        <label className="stack">
          Name (required)
          <input
            ref={nameInput}
            required
            value={name}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? nameErrorId : undefined}
            onChange={event => {
              edits.current.name += 1;
              setName(event.target.value);
              setMessage("");
              if (event.target.value.trim()) setNameError("");
            }}
          />
        </label>
        {nameError && (
          <p id={nameErrorId} className="error" role="alert">
            {nameError}
          </p>
        )}
        <label className="stack">
          Bio (280 characters max)
          <textarea
            value={bio}
            maxLength={280}
            onChange={event => {
              edits.current.bio += 1;
              setBio(event.target.value);
              setMessage("");
            }}
          />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save profile"}
        </button>
        {message && <p aria-live="polite">{message}</p>}
      </form>
    </section>
  );
}
