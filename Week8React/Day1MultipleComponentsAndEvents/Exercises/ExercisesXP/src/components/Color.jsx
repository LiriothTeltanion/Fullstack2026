import { useEffect, useState } from "react";

function Color() {
  const [favoriteColor, setFavoriteColor] = useState("red");
  const [log, setLog] = useState([]);

  // Runs after every render where favoriteColor changed.
  useEffect(() => {
    setLog(lines => [...lines, `useEffect reached, color is ${favoriteColor}`]);
  }, [favoriteColor]);

  return (
    <div>
      <p>
        My favorite color is <strong>{favoriteColor}</strong>
      </p>
      <button onClick={() => setFavoriteColor("blue")}>Change to blue</button>
      <ul className="muted">
        {log.map((line, index) => (
          <li key={index}>{line}</li>
        ))}
      </ul>
    </div>
  );
}

export default Color;
