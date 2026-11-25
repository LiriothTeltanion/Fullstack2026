import { useState } from "react";

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL;

function WebhookPost() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [body, setBody] = useState({
    key1: "myusername",
    email: "mymail@gmail.com",
    name: "Isaac",
  });

  const sendData = async event => {
    event.preventDefault();
    if (sending) return;
    if (!WEBHOOK_URL) {
      setStatus("Add VITE_WEBHOOK_URL to a .env file first.");
      return;
    }
    setSending(true);
    setStatus("Sending…");
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
      if (!response.ok) throw new Error(`The receiver answered ${response.status}`);
      setStatus(`Sent. Status ${response.status}. Check webhook.site.`);
    } catch (error) {
      setStatus(`Request failed: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={sendData}>
      <label>
        Username
        <input
          name="key1"
          value={body.key1}
          required
          onChange={event => setBody({ ...body, key1: event.target.value })}
        />
      </label>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={body.email}
          required
          onChange={event => setBody({ ...body, email: event.target.value })}
        />
      </label>
      <label>
        Name
        <input
          name="name"
          value={body.name}
          required
          onChange={event => setBody({ ...body, name: event.target.value })}
        />
      </label>
      <button type="submit" disabled={sending}>
        Press me to post some data
      </button>
      <p className="muted" role="status" aria-live="polite">
        {status}
      </p>
    </form>
  );
}

export default WebhookPost;
