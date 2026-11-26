import { useState } from "react";
import CompassClock from "./components/CompassClock.jsx";
import GalleryDemo from "./GalleryDemo.jsx";

function App() {
  const [view, setView] = useState("clock");

  return (
    <>
      <nav className="practice-switch" aria-label="Practice views">
        <button aria-pressed={view === "clock"} onClick={() => setView("clock")}>
          Compass clock
        </button>
        <button aria-pressed={view === "gallery"} onClick={() => setView("gallery")}>
          Original widgets
        </button>
      </nav>
      {view === "clock" ? <CompassClock /> : <GalleryDemo />}
    </>
  );
}

export default App;
