import { useState } from "react";
import quotes from "./quotes.js";
import { randomColor, randomIndex } from "./utils/random.js";
import QuoteBox from "./components/QuoteBox.jsx";

function App() {
  const [index, setIndex] = useState(() => randomIndex(quotes.length, -1));
  const [color, setColor] = useState(randomColor);

  const newQuote = () => {
    setIndex(randomIndex(quotes.length, index));
    setColor(randomColor());
  };

  return (
    <div className="screen" style={{ backgroundColor: color }}>
      <QuoteBox quote={quotes[index]} color={color} onNewQuote={newQuote} />
    </div>
  );
}

export default App;
