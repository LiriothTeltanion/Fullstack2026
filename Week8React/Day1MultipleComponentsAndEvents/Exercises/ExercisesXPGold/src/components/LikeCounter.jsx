import { useState } from "react";
import LikeButton from "./LikeButton.jsx";

const fruits = ["Apple", "Banana", "Cherry"];

function LikeCounter() {
  // The parent owns the numbers, the buttons only call onLike.
  const [likes, setLikes] = useState({ Apple: 0, Banana: 0, Cherry: 0 });

  const addLike = fruit => {
    setLikes(current => ({ ...current, [fruit]: current[fruit] + 1 }));
  };

  const total = Object.values(likes).reduce((sum, value) => sum + value, 0);

  return (
    <div>
      <div className="row">
        {fruits.map(fruit => (
          <LikeButton
            key={fruit}
            label={fruit}
            count={likes[fruit]}
            onLike={() => addLike(fruit)}
          />
        ))}
      </div>
      <p>Total likes: {total}</p>
    </div>
  );
}

export default LikeCounter;
