import { useEffect, useState } from "react";
import MessageForm from "./components/MessageForm.jsx";
import MessageList from "./components/MessageList.jsx";

// Same origin in production (Express serves this page), Vite proxy in development
export default function App() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/messages")
      .then(response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(data => {
        setMessages(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function addMessage(newMessage) {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    // Newest first, like the server's order
    setMessages(current => [data, ...current]);
  }

  async function removeMessage(id) {
    const response = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (response.ok) {
      setMessages(current => current.filter(m => m.id !== id));
    }
  }

  return (
    <main className="app">
      <header>
        <h1>Guestbook</h1>
        <p className="muted">Leave a short note. It's saved in PostgreSQL.</p>
      </header>
      <MessageForm onAdd={addMessage} />
      {status === "loading" && <p className="muted">Loading messages…</p>}
      {status === "error" && (
        <p className="error">Could not load the messages. Is the server running?</p>
      )}
      {status === "ready" && <MessageList messages={messages} onDelete={removeMessage} />}
    </main>
  );
}
