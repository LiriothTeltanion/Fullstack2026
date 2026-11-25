import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { login } from "./authSlice";
export default function Login() {
  const { isAuthenticated, status, error } = useAppSelector(s => s.auth),
    dispatch = useAppDispatch(),
    navigate = useNavigate();
  const [email, setEmail] = useState("demo@example.test"),
    [password, setPassword] = useState(""),
    [localError, setLocalError] = useState("");
  useEffect(() => {
    if (isAuthenticated) navigate("/ninja/profile", { replace: true });
  }, [isAuthenticated, navigate]);
  function submit(e: FormEvent) {
    e.preventDefault();
    if (password !== "practice123") {
      setLocalError("Use the fictional practice password: practice123.");
      setPassword("");
      return;
    }
    setLocalError("");
    setPassword("");
    // Only email reaches Redux action metadata; the password stays in this form.
    void dispatch(login(email));
  }
  return (
    <>
      <h1>Practice profile</h1>
      <p>Local demo. The session resets on reload.</p>
      <form className="panel form" onSubmit={submit}>
        <h2>Sign in to your practice profile</h2>
        <p>Demo: demo@example.test · practice123</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </label>
        <label>
          Practice password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
        </label>
        <button disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
        {(localError || error) && <p role="alert">{localError || error}</p>}
      </form>
    </>
  );
}
