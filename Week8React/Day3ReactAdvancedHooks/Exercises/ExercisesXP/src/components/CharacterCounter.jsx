import { useRef, useState } from "react";

function CharacterCounter() {
  // The ref reads the input directly, the state only holds the count.
  const inputRef = useRef(null);
  const [count, setCount] = useState(0);

  const handleInput = () => {
    setCount(inputRef.current.value.length);
  };

  return (
    <div>
      <textarea
        aria-label="Text to count"
        ref={inputRef}
        rows="3"
        cols="40"
        onInput={handleInput}
      />
      <p>Characters: {count}</p>
      <button onClick={() => inputRef.current.focus()}>Focus the text box</button>
    </div>
  );
}

export default CharacterCounter;
