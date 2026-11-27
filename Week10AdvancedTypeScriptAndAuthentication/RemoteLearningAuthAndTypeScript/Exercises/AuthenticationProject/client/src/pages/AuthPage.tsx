import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../auth/AuthContext";

type Mode = "login" | "register";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card stack" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>
      {mode === "register" && (
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          aria-label="Name"
        />
      )}
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        autoComplete="email"
        aria-label="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password (8+ characters)"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        aria-label="Password"
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy}>
        {busy ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
      </button>
      <button
        type="button"
        className="secondary"
        disabled={busy}
        onClick={() => {
          setError("");
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "No account yet? Sign up" : "Have an account? Log in"}
      </button>
    </form>
  );
}
