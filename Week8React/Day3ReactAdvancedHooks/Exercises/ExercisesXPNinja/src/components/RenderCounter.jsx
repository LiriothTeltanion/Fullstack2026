import { memo, useCallback, useRef, useState } from "react";

// memo skips the render when the props are the same as last time.
const CounterButton = memo(function CounterButton({ label, onClick }) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <button onClick={onClick}>
      {label} (rendered {renders.current}×)
    </button>
  );
});

function RenderCounter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // Same function object between renders, so memo can do its job.
  const increment = useCallback(() => setCount(c => c + 1), []);
  // A new function on every render: this button always re-renders.
  const incrementNoCallback = () => setCount(c => c + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <input
        placeholder="Type here to re-render the parent"
        value={text}
        onChange={event => setText(event.target.value)}
      />
      <div className="row">
        <CounterButton label="With useCallback" onClick={increment} />
        <CounterButton label="Without useCallback" onClick={incrementNoCallback} />
      </div>
    </div>
  );
}

export default RenderCounter;
