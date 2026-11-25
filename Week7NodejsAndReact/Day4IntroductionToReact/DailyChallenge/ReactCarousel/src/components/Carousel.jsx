import { useEffect, useState } from "react";

// A carousel without libraries: one index in state decides which slide shows.
export default function Carousel({ slides, interval = 4000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // % keeps the index inside the array, also when going back from 0.
  const goTo = i => setIndex((i + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Autoplay: a new timer after every change, cleaned up before the next one.
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => clearTimeout(timer);
  }, [index, paused, interval, slides.length]);

  function handleKey(event) {
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") prev();
  }

  return (
    <div
      className="carousel"
      tabIndex={0}
      onKeyDown={handleKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((slide, i) => (
          <figure
            key={slide.id}
            className="slide"
            style={{
              background: `linear-gradient(135deg, ${slide.colors[0]}, ${slide.colors[1]})`,
            }}
            aria-hidden={i !== index}
          >
            <figcaption>
              <h2>{slide.title}</h2>
              <p>{slide.caption}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <button className="arrow left" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="arrow right" onClick={next} aria-label="Next slide">
        ›
      </button>

      <div className="dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={i === index ? "dot active" : "dot"}
            onClick={() => goTo(i)}
            aria-label={`Go to ${slide.title}`}
          />
        ))}
      </div>

      <div className="thumbs">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            className={i === index ? "thumb active" : "thumb"}
            style={{
              background: `linear-gradient(135deg, ${slide.colors[0]}, ${slide.colors[1]})`,
            }}
            onClick={() => goTo(i)}
          >
            {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
}
