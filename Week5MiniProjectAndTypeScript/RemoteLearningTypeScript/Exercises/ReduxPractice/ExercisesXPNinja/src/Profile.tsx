import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, updateProfile } from "./authSlice";
export default function Profile() {
  const { user, status, error } = useAppSelector(s => s.auth),
    dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || ""),
    [email, setEmail] = useState(user?.email || ""),
    [bio, setBio] = useState(user?.bio || ""),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);
  if (!user) return null;
  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaved(false);
    const result = await dispatch(updateProfile({ ...user!, name, email, bio }));
    if (updateProfile.fulfilled.match(result)) setSaved(true);
  }
  return (
    <>
      <h1>Practice profile</h1>
      <p>Signed in as {user.name}.</p>
      <form className="panel form" onSubmit={submit} aria-label="Edit practice profile">
        <h2>Edit profile</h2>
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} maxLength={80} />
        </label>
        <label>
          Fictional email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          About you
          <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={300} />
        </label>
        <button disabled={status === "loading"}>
          {status === "loading" ? "Saving..." : "Save profile"}
        </button>
        {saved && <p role="status">Profile updated.</p>}
        {error && <p role="alert">{error}</p>}
      </form>
      <button
        className="secondary"
        disabled={status === "loading"}
        onClick={() => {
          void dispatch(logout());
        }}
      >
        Sign out
      </button>
    </>
  );
}
