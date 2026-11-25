import { useState } from "react";
import QuoteBox from "./components/QuoteBox.jsx";
import { quotes, colors } from "./quotes.js";
import { randomOtherIndex } from "./randomPick.js";

// Exercise XP Ninja: a random quote machine. Two indexes in state decide
// which quote and which color show; neither repeats twice in a row.
export default function App() {
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [colorIndex, setColorIndex] = useState(0);
  const [seen, setSeen] = useState(1);

  function nextQuote() {
    setQuoteIndex(i => randomOtherIndex(quotes.length, i));
    setColorIndex(i => randomOtherIndex(colors.length, i));
    setSeen(n => n + 1);
  }

  const color = colors[colorIndex];

  return (
    <main style={{ backgroundColor: color }}>
      <QuoteBox quote={quotes[quoteIndex]} color={color} onNext={nextQuote} />
      <p className="counter">Quotes shown: {seen}</p>
    </main>
  );
}
