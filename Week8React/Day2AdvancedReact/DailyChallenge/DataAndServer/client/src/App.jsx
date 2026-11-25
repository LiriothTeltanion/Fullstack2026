import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Loading…");
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  // Part 1: GET /api/hello when the page loads.
  useEffect(() => {
    fetch("/api/hello")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(() => setMessage("Is the server running on port 5000?"));
  }, []);

  // Part 2: POST the input to /api/world.
  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const response = await fetch("/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: input }),
      });
      const data = await response.json();
      setReply(response.ok ? data.message : data.error);
    } catch {
      setReply("The server did not answer.");
    }
  };

  return (
    <main className="page">
      <h1>{message}</h1>

      <form className="card" onSubmit={handleSubmit}>
        <h2>Post to Server:</h2>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Type something"
        />{" "}
        <button type="submit">Submit</button>
      </form>

      {reply && <p className="card">{reply}</p>}
    </main>
  );
}

export default App;
