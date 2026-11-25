import Carousel from "./components/Carousel.jsx";
import { slides } from "./slides.js";

export default function App() {
  return (
    <main>
      <h1>Places I want to see</h1>
      <Carousel slides={slides} />
      <p className="hint">Arrows, dots, thumbnails or the ← → keys. Hover to pause.</p>
    </main>
  );
}
