import type { User } from "../types";
import UserCard from "./UserCard";

// Exercise 4: rendering a typed array.
export default function UserList({ users }: { users: User[] }) {
  if (users.length === 0) return <p className="muted">No users.</p>;
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} highlight={user.role === "mentor"} />
      ))}
    </div>
  );
}
