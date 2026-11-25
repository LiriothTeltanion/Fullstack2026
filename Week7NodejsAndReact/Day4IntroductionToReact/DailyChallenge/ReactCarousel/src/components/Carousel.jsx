import { useEffect, useState } from "react";
import { Carousel as ResponsiveCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Carousel({ slides, interval = 4000 }) {
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <div className="assignment-carousel">
      <ResponsiveCarousel
        ariaLabel="Travel destinations"
        useKeyboardArrows
        infiniteLoop
        autoPlay={!reducedMotion}
        interval={interval}
        stopOnHover
        transitionTime={reducedMotion ? 0 : 350}
        renderThumbs={() => slides.map(slide => <span key={slide.id}>{slide.title}</span>)}
      >
        {slides.map(slide => (
          <figure
            key={slide.id}
            className="destination"
            style={{ background: "linear-gradient(135deg, " + slide.colors.join(",") + ")" }}
          >
            <figcaption>
              <h2>{slide.title}</h2>
              <p>{slide.caption}</p>
            </figcaption>
          </figure>
        ))}
      </ResponsiveCarousel>
    </div>
  );
}
