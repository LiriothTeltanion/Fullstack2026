import { useState } from "react";
import { api } from "../api.js";

// One form for both actions: "login" shows 2 fields, "register" shows 3
export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = mode === "login" ? { email: form.email, password: form.password } : form;
      const data = await api(`/auth/${mode}`, { method: "POST", body });
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{mode === "login" ? "Log in" : "Create an account"}</h2>

      {mode === "register" && (
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
      </label>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Please wait…" : mode === "login" ? "Log in" : "Sign up"}
      </button>

      <button
        type="button"
        className="link"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "No account yet? Sign up" : "Already have an account? Log in"}
      </button>
    </form>
  );
}
