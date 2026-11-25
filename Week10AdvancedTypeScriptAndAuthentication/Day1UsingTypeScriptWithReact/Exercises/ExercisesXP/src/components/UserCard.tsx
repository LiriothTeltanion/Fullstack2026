import type { User } from "../types";

interface UserCardProps {
  name?: string;
  age?: number;
  role?: string;
  email?: string;
  user?: User;
  highlight?: boolean;
}

export default function UserCard({
  name = "Anonymous",
  age = 0,
  role = "Member",
  email,
  user,
  highlight = false,
}: UserCardProps) {
  return (
    <div className="card" style={{ borderColor: highlight ? "var(--accent)" : undefined }}>
      <strong>{user?.name ?? name}</strong> <span className="muted">- {user?.role ?? role}</span>
      <p className="muted" style={{ margin: 0 }}>
        {age > 0 ? age + " years old" : "Age not provided"}
      </p>
      {(user?.email ?? email) && <p className="muted">{user?.email ?? email}</p>}
    </div>
  );
}
