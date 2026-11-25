import { Component } from "react";

class App extends Component {
  state = { message: "Loading…", input: "", reply: "", sending: false };

  // Part 1: GET /api/hello when the page loads.
  async componentDidMount() {
    const controller = new AbortController();
    this.controller = controller;
    try {
      const response = await fetch("/api/hello", { signal: controller.signal });
      if (!response.ok) throw new Error("Greeting request failed");
      const data = await response.json();
      if (!controller.signal.aborted) this.setState({ message: data.message });
    } catch {
      if (!controller.signal.aborted) {
        this.setState({ message: "Is the server running on port 5000?" });
      }
    }
  }

  componentWillUnmount() {
    this.controller.abort();
  }

  // Part 2: POST the input to /api/world.
  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ sending: true });
    try {
      const response = await fetch("/api/world", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: this.state.input }),
        signal: this.controller.signal,
      });
      const data = await response.json();
      if (!this.controller.signal.aborted) {
        this.setState({ reply: response.ok ? data.message : data.error });
      }
    } catch {
      if (!this.controller.signal.aborted) this.setState({ reply: "The server did not answer." });
    } finally {
      if (!this.controller.signal.aborted) this.setState({ sending: false });
    }
  };

  render() {
    const { message, input, reply, sending } = this.state;
    return (
      <main className="page">
        <h1>{message}</h1>

        <form className="card" onSubmit={this.handleSubmit}>
          <h2>Post to Server:</h2>
          <input
            value={input}
            onChange={event => this.setState({ input: event.target.value })}
            placeholder="Type something"
            aria-label="Message to the server"
          />{" "}
          <button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Submit"}
          </button>
        </form>

        <p className={reply ? "card" : undefined} role="status" aria-live="polite">
          {reply}
        </p>
      </main>
    );
  }
}

export default App;
