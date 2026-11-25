import { useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "../types";

interface SignupFormProps {
  onAdd: (user: Omit<User, "id">) => void;
}

// Exercise 5: typed change and submit events.
export default function SignupForm({ onAdd }: SignupFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<User["role"]>("student");

  const handleRole = (event: ChangeEvent<HTMLSelectElement>) => {
    setRole(event.target.value === "mentor" ? "mentor" : "student");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.includes("@")) return;
    onAdd({ name: name.trim(), email: email.trim(), role });
    setName("");
    setEmail("");
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
        placeholder="Name"
        aria-label="Name"
      />
      <input
        type="email"
        value={email}
        onChange={event => setEmail(event.target.value)}
        placeholder="Email"
        aria-label="Email"
      />
      <select value={role} onChange={handleRole} aria-label="Role">
        <option value="student">Student</option>
        <option value="mentor">Mentor</option>
      </select>
      <button type="submit">Add user</button>
    </form>
  );
}
