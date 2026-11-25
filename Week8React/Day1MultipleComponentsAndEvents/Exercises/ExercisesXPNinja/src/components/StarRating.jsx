import { useState } from "react";

function StarRating({ max }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  // While the mouse is over a star, show that value instead of the saved one.
  const shown = hovered || rating;

  return (
    <div>
      <div onMouseLeave={() => setHovered(0)}>
        {Array.from({ length: max }, (_, index) => {
          const value = index + 1;
          return (
            <button
              key={value}
              className="star"
              aria-label={`${value} stars`}
              onMouseEnter={() => setHovered(value)}
              onClick={() => setRating(value)}
            >
              {value <= shown ? "★" : "☆"}
            </button>
          );
        })}
      </div>
      <p className="muted">{rating ? `You rated ${rating} out of ${max}` : "No rating yet"}</p>
    </div>
  );
}

export default StarRating;
