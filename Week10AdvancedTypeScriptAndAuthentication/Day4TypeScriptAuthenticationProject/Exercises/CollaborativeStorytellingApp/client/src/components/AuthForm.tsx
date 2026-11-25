import { useState, type FormEvent } from "react";
import { api } from "../api";
import { AppLink } from "../navigation";
import type { User } from "../types";

interface AuthFormProps {
  onLoggedIn: (user: User) => void;
  mode?: "login" | "register";
  returnTo?: string;
}
export default function AuthForm({
  onLoggedIn,
  mode = "login",
  returnTo = "/stories",
}: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const register = mode === "register";
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { user } = register
        ? await api.register(username.trim(), password, email.trim())
        : await api.login(username.trim(), password);
      onLoggedIn(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="card stack auth-form" onSubmit={handleSubmit}>
      <h2 id="page-title" tabIndex={-1}>
        {register ? "Create an account" : "Log in"}
      </h2>
      <p className="muted">
        {register ? "Start a story and invite other voices." : "Welcome back to your next chapter."}
      </p>
      <label className="field">
        {register ? "Username" : "Username or email"}
        <input
          value={username}
          onChange={event => setUsername(event.target.value)}
          autoComplete="username"
          required
          disabled={busy}
        />
      </label>
      {register && (
        <label className="field">
          Email
          <input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={busy}
          />
          <small className="muted">
            Used to sign in. Not shown in stories or collaborator lists.
          </small>
        </label>
      )}
      <label className="field">
        Password
        <input
          type="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          minLength={register ? 8 : undefined}
          autoComplete={register ? "new-password" : "current-password"}
          required
          disabled={busy}
        />
      </label>
      {register && <small className="muted">Use at least eight characters.</small>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy}>
        {busy ? (register ? "Creating account…" : "Signing in…") : register ? "Sign up" : "Log in"}
      </button>
      <AppLink
        className="auth-alternative"
        href={(register ? "/login" : "/register") + "?next=" + encodeURIComponent(returnTo)}
      >
        {register ? "I already have an account" : "I need an account"}
      </AppLink>
    </form>
  );
}
