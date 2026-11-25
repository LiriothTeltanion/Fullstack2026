import { useEffect, useRef, useState } from "react";

function ColorWithHooks() {
  const [favoriteColor, setFavoriteColor] = useState("red");
  const previous = useRef(favoriteColor);

  // [] = componentDidMount; the cleanup = componentWillUnmount.
  useEffect(() => {
    const timer = setTimeout(() => setFavoriteColor("yellow"), 1000);
    return () => clearTimeout(timer);
  }, []);

  // [favoriteColor] = componentDidUpdate for this value.
  useEffect(() => {
    if (previous.current !== favoriteColor) {
      console.log(`useEffect: ${previous.current} -> ${favoriteColor}`);
      previous.current = favoriteColor;
    }
  }, [favoriteColor]);

  return (
    <div>
      <h3>My Favorite Color is {favoriteColor}</h3>
      <button onClick={() => setFavoriteColor("blue")}>Change color</button>
    </div>
  );
}

export default ColorWithHooks;
