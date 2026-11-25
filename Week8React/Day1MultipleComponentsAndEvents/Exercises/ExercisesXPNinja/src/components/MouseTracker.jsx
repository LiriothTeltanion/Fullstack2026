import { useState } from "react";

function MouseTracker() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);

  const handleMove = event => {
    // Coordinates relative to the box, not to the whole page.
    const box = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: Math.round(event.clientX - box.left),
      y: Math.round(event.clientY - box.top),
    });
  };

  return (
    <div
      className="tracker"
      onMouseMove={handleMove}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
    >
      {inside ? `x: ${position.x}, y: ${position.y}` : "Move the mouse in here"}
    </div>
  );
}

export default MouseTracker;
