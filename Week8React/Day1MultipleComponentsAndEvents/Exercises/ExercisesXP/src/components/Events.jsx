import { useState } from "react";

function Events() {
  const [message, setMessage] = useState("Nothing happened yet.");
  const [isToggleOn, setIsToggleOn] = useState(true);

  const clickMe = () => {
    setMessage("I was clicked");
  };

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      setMessage(`You typed: ${event.target.value}`);
    }
  };

  const toggle = () => {
    setIsToggleOn(current => !current);
  };

  return (
    <div className="stack">
      <button onClick={clickMe}>Click me</button>
      <input type="text" placeholder="Type and press Enter" onKeyDown={handleKeyDown} />
      <button onClick={toggle}>{isToggleOn ? "ON" : "OFF"}</button>
      <p className="muted">{message}</p>
    </div>
  );
}

export default Events;
