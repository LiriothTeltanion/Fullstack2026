import { useLayoutEffect, useRef, useState } from "react";
import QuoteMachine from "./App.jsx";
import LiveClock from "./components/LiveClock.jsx";
import ValidationForm from "./components/ValidationForm.jsx";

export default function PracticeApp() {
  const [view, setView] = useState("practice");
  const practiceHeading = useRef(null);
  const quoteRegion = useRef(null);
  const shouldFocus = useRef(false);

  useLayoutEffect(() => {
    if (!shouldFocus.current) return;
    (view === "practice" ? practiceHeading.current : quoteRegion.current)?.focus();
    shouldFocus.current = false;
  }, [view]);

  function choose(next) {
    if (next === view) return;
    shouldFocus.current = true;
    setView(next);
  }

  return (
    <div className="practice-app">
      <nav className="practice-nav" aria-label="React practice views">
        <span>State & a little practice</span>
        <div>
          <button
            type="button"
            aria-pressed={view === "practice"}
            aria-controls="practice-view"
            onClick={() => choose("practice")}
          >
            Clock & form
          </button>
          <button
            type="button"
            aria-pressed={view === "quotes"}
            aria-controls="quote-view"
            onClick={() => choose("quotes")}
          >
            Quote machine
          </button>
        </div>
      </nav>
      <main className="practice-main" id="practice-view" hidden={view !== "practice"}>
        <h1 ref={practiceHeading} tabIndex="-1">
          Clock & validation
        </h1>
        <p className="practice-intro">Watch the time move, then try the form rules.</p>
        <div className="practice-grid">
          {view === "practice" && <LiveClock />}
          <ValidationForm />
        </div>
      </main>
      {/* Keep the original demo mounted so its quote count survives a view change. */}
      <section
        className="quote-view"
        id="quote-view"
        ref={quoteRegion}
        tabIndex="-1"
        aria-label="Quote machine"
        hidden={view !== "quotes"}
      >
        <QuoteMachine />
      </section>
    </div>
  );
}
