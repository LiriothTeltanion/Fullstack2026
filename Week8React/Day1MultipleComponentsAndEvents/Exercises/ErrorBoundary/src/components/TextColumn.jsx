import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";

const example = { function: "I live to crash" };

function ObjectParagraph({ asObject }) {
  // Deliberately render a plain object to demonstrate an actual React render failure.
  return <p className="object-paragraph">{asObject ? example : JSON.stringify(example)}</p>;
}

export default function TextColumn() {
  const [asObject, setAsObject] = useState(false);
  const [eventMessage, setEventMessage] = useState("");

  function invokeEventHandler() {
    try {
      throw new Error("Event-handler demonstration");
    } catch (error) {
      // Boundaries do not catch event handlers. Handle this error at its source.
      console.error("Event handler error handled locally:", error);
      setEventMessage(
        "The event error was handled locally. The paragraph boundary did not catch it."
      );
    }
  }

  return (
    <section className="practice-card text-column" aria-labelledby="text-heading">
      <h2 id="text-heading">Keep the rest intact.</h2>
      <p>
        The first paragraph stays readable. Only the next paragraph is inside the smaller error
        boundary.
      </p>
      <div className="paragraph-slot" data-testid="paragraph-slot">
        <ErrorBoundary
          fallback="Only this paragraph needs a restart."
          resetLabel="Restore paragraph"
          onReset={() => setAsObject(false)}
        >
          <ObjectParagraph asObject={asObject} />
        </ErrorBoundary>
      </div>
      <div className="practice-actions">
        <button onClick={() => setAsObject(true)}>Replace string with object</button>
        <button className="secondary" onClick={invokeEventHandler}>
          Invoke event handler
        </button>
      </div>
      <p className="event-status" role="status">
        {eventMessage || "The event-handler example leaves the page running."}
      </p>
    </section>
  );
}
