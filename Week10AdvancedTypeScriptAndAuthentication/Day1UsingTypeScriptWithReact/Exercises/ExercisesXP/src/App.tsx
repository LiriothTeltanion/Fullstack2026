import { useState } from "react";
import UserCard from "./components/UserCard";
import Counter from "./components/Counter";
import Greeting from "./components/Greeting";
import SignupForm from "./components/SignupForm";
import UserList from "./components/UserList";
import type { User } from "./types";

const START_USERS: User[] = [
  { id: 1, name: "Noa Levi", email: "noa@example.com", role: "mentor" },
  { id: 2, name: "Ariel Cohen", email: "ariel@example.com", role: "student" },
];

export default function App() {
  const [users, setUsers] = useState<User[]>(START_USERS);

  const addUser = (data: Omit<User, "id">) => {
    setUsers(current => [...current, { ...data, id: Date.now() }]);
  };

  return (
    <main>
      <h1>TypeScript with React</h1>
      <section className="card">
        <h2>1. Greeting</h2>
        <Greeting name="Kevin" />
        <Greeting name="Maya" age={29} />
      </section>
      <section className="card">
        <h2>2. Counter</h2>
        <Counter start={10} />
      </section>
      <section className="card">
        <h2>3-5. Users</h2>
        <UserCard />
        <UserCard name="Demo reader" age={24} role="Guest" />
        <SignupForm onAdd={addUser} />
        <UserList users={users} />
      </section>
    </main>
  );
}
