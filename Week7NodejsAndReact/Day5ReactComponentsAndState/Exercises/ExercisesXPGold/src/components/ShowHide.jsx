import { useCallback, useEffect, useState } from "react";

function Child({ onLog }) {
  // The cleanup function runs when the component leaves the page.
  useEffect(() => {
    onLog("Child mounted");
    return () => onLog("Child unmounted");
  }, [onLog]);

  return <p className="preview">Hello, I am the child component.</p>;
}

// Exercise 3: conditional rendering adds and removes Child from the page.
export default function ShowHide() {
  const [show, setShow] = useState(true);
  const [log, setLog] = useState([]);

  // useCallback keeps the same function between renders, so Child's
  // useEffect does not run again every time the log grows.
  const addLog = useCallback(line => setLog(lines => [...lines, line]), []);

  return (
    <div>
      <button onClick={() => setShow(s => !s)}>{show ? "Delete child" : "Show child"}</button>
      {show && <Child onLog={addLog} />}
      <ol>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}
