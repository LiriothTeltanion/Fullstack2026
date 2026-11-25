import { useState, type FormEvent } from "react";
import { api } from "../api";
import type { User } from "../types";

interface AuthFormProps {
  onLoggedIn: (user: User) => void;
}

export default function AuthForm({ onLoggedIn }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { user } =
        mode === "login"
          ? await api.login(username, password)
          : await api.register(username, password);
      onLoggedIn(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card stack" onSubmit={handleSubmit} style={{ maxWidth: 380 }}>
      <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>
      <input
        value={username}
        onChange={event => setUsername(event.target.value)}
        placeholder="Username"
        autoComplete="username"
        aria-label="Username"
      />
      <input
        type="password"
        value={password}
        onChange={event => setPassword(event.target.value)}
        placeholder="Password (8+ characters)"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        aria-label="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={busy}>
        {mode === "login" ? "Log in" : "Sign up"}
      </button>
      <button
        type="button"
        className="secondary"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "I need an account" : "I already have an account"}
      </button>
    </form>
  );
}
