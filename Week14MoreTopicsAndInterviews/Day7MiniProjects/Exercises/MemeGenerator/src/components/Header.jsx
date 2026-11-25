import { useState } from "react";
import headerFallback from "../assets/header-fallback.svg";

export default function Header() {
  const [usingFallback, setUsingFallback] = useState(false);
  return (
    <header className="header">
      <img
        className="logo"
        src={
          usingFallback
            ? headerFallback
            : "https://www.pngall.com/wp-content/uploads/2016/05/Trollface.png"
        }
        alt={usingFallback ? "Original smiling face icon" : "Trollface header illustration"}
        width="40"
        height="40"
        referrerPolicy="no-referrer"
        onError={() => setUsingFallback(true)}
      />
      <p>Meme Generator</p>
    </header>
  );
}
