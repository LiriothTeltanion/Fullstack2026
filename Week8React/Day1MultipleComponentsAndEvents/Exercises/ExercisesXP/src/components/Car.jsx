import { useState } from "react";
import Garage from "./Garage.jsx";

function Car({ carInfo }) {
  // The color lives in the Car's own state, the model comes from props.
  const [color] = useState("red");

  return (
    <div>
      <p>
        This car is a {color} {carInfo.model}.
      </p>
      <Garage size="small" />
    </div>
  );
}

export default Car;
