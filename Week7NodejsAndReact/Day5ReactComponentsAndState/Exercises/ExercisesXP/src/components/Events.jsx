import { useState } from "react";

// Exercise 2: click, key and toggle events. Messages show on the page.
export default function Events() {
  const [message, setMessage] = useState("");
  const [isToggleOn, setIsToggleOn] = useState(true);

  const clickMe = () => setMessage("I was clicked");

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      setMessage(`The Enter key was pressed, your input is: ${event.target.value}`);
    }
  }

  return (
    <div className="stack">
      <button onClick={clickMe}>Click Me</button>
      <input placeholder="Press the ENTER key!" onKeyDown={handleKeyDown} />
      <button onClick={() => setIsToggleOn(on => !on)}>{isToggleOn ? "ON" : "OFF"}</button>
      <p aria-live="polite">{message}</p>
    </div>
  );
}
