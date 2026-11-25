import { useEffect, useState } from "react";
import type { User } from "../types";
import UserCard from "./UserCard";

type RemoteUser = Pick<User, "id" | "name" | "email">;

export default function UserList({ users = [] }: { users?: User[] }) {
  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error("Server answered " + response.status);
        return response.json() as Promise<unknown>;
      })
      .then(data => {
        if (
          !Array.isArray(data) ||
          !data.every(
            user =>
              user &&
              typeof user.id === "number" &&
              typeof user.name === "string" &&
              typeof user.email === "string"
          )
        )
          throw new Error("The server returned an invalid user list.");
        if (!controller.signal.aborted) setRemoteUsers(data as RemoteUser[]);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : "Could not load users.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div>
      <h3>Users from the API</h3>
      {loading && <p role="status">Loading users...</p>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {!loading && !error && remoteUsers.length === 0 && <p>No users returned.</p>}
      {remoteUsers.map(user => (
        <UserCard key={user.id} name={user.name} email={user.email} />
      ))}
      {users.length > 0 && <h3>Local signup examples</h3>}
      {users.map(user => (
        <UserCard key={user.id} user={user} highlight={user.role === "mentor"} />
      ))}
    </div>
  );
}
