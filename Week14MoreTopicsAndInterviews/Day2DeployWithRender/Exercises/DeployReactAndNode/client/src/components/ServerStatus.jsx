import { useEffect, useState } from "react";

// Calls /api/health once and shows whether the API answered
export default function ServerStatus({ apiUrl }) {
  const [status, setStatus] = useState("checking");
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/api/health`)
      .then(response => response.json())
      .then(data => {
        setStatus(data.status === "ok" ? "online" : "offline");
        setUptime(data.uptime);
      })
      .catch(() => setStatus("offline"));
  }, [apiUrl]);

  return (
    <p className={`status status-${status}`}>
      <span className="dot" aria-hidden="true"></span>
      API {status}
      {status === "online" && uptime !== null && ` · up for ${uptime}s`}
      <span className="api-url">{apiUrl || "same origin (Vite proxy)"}</span>
    </p>
  );
}
