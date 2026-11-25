import type { User } from "../types";

// Exercise 3: an object prop typed with an interface, plus a default value.
interface UserCardProps {
  user: User;
  highlight?: boolean;
}

export default function UserCard({ user, highlight = false }: UserCardProps) {
  return (
    <div className="card" style={{ borderColor: highlight ? "var(--accent)" : undefined }}>
      <strong>{user.name}</strong> <span className="muted">· {user.role}</span>
      <p className="muted" style={{ margin: 0 }}>
        {user.email}
      </p>
    </div>
  );
}
