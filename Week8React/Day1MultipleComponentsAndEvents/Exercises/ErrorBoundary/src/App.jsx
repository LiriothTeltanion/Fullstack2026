import { useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import CounterDemo from "./CounterDemo.jsx";
import ImageColumn from "./components/ImageColumn.jsx";
import TextColumn from "./components/TextColumn.jsx";

function App() {
  const [view, setView] = useState(() =>
    window.location.hash === "#counters" ? "counters" : "practice"
  );
  useEffect(() => {
    const update = () => setView(window.location.hash === "#counters" ? "counters" : "practice");
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return (
    <>
      <header className="practice-header">
        <div className="practice-brand">Error boundaries</div>
        <nav aria-label="Practice demos">
          <a href="#practice" aria-current={view === "practice" ? "page" : undefined}>
            Paragraph boundary
          </a>
          <a href="#counters" aria-current={view === "counters" ? "page" : undefined}>
            Counter simulations
          </a>
        </nav>
      </header>
      {view === "counters" ? (
        <CounterDemo />
      ) : (
        <main className="practice-page">
          <div className="practice-intro">
            <h1>
              One paragraph.
              <br />A smaller blast radius.
            </h1>
            <p>
              A rendering error should interrupt as little of the page as possible. Load the images,
              break the paragraph, then recover it.
            </p>
          </div>
          <div className="practice-columns">
            <ImageColumn />
            <ErrorBoundary fallback="The text column could not render.">
              <TextColumn />
            </ErrorBoundary>
          </div>
          <p className="practice-footnote">
            The paragraph has its own boundary. Event-handler errors are handled explicitly where
            they happen.
          </p>
        </main>
      )}
    </>
  );
}

export default App;
