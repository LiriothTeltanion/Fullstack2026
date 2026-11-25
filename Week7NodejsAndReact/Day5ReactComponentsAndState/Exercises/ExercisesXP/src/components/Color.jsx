import { useEffect, useState } from "react";

// Exercise 4: useEffect runs after the render; here once, on mount.
export default function Color() {
  const [favoriteColor, setFavoriteColor] = useState("red");
  const [log, setLog] = useState([]);

  useEffect(() => {
    setLog(lines => [...lines, "useEffect reached after the first render"]);
    setFavoriteColor("yellow");
  }, []);

  return (
    <div>
      <h3 style={{ color: favoriteColor }}>My Favorite Color is {favoriteColor}</h3>
      <button onClick={() => setFavoriteColor("blue")}>Change to blue</button>
      <ul>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
