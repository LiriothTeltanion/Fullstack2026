import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitAccount } from "./api.js";

export default function AuthForm({ mode, onAuthenticated }) {
  const registering = mode === "register";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const controller = useRef(null);
  const navigate = useNavigate();

  useEffect(() => () => controller.current?.abort(), []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (sending) return;
    const request = new AbortController();
    controller.current = request;
    setSending(true);
    setError("");
    try {
      const body = registering ? { name, email, password } : { email, password };
      const user = await submitAccount(mode, body, request.signal);
      if (request.signal.aborted) return;
      onAuthenticated(user);
      navigate("/dashboard", { replace: true });
    } catch (problem) {
      if (!request.signal.aborted) setError(problem.message);
    } finally {
      if (!request.signal.aborted) setSending(false);
    }
  }

  return (
    <section className="account-card" aria-labelledby="account-title">
      <h1 id="account-title">{registering ? "Create your account" : "Sign in"}</h1>
      <form onSubmit={handleSubmit}>
        {registering && (
          <label htmlFor="name">
            Name
            <input
              id="name"
              name="name"
              dir="auto"
              autoComplete="name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
              maxLength={100}
            />
          </label>
        )}
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            maxLength={255}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={registering ? "new-password" : "current-password"}
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
          />
        </label>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" disabled={sending}>
          {sending ? "Sending…" : registering ? "Register" : "Sign in"}
        </button>
      </form>
      <p role="status" aria-live="polite">
        {sending ? "Contacting the account service…" : ""}
      </p>
      <Link to={registering ? "/signin" : "/register"}>
        {registering ? "Already registered? Sign in" : "Create an account"}
      </Link>
    </section>
  );
}
