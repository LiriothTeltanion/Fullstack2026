import { useState } from "react";
import Garage from "./Garage.jsx";

// Exercise 1: the model comes from props, the color lives in state.
export default function Car({ carInfo }) {
  const [color] = useState("red");

  return (
    <div>
      <h3>
        This car is {color} {carInfo.model}
      </h3>
      <Garage size="small" />
    </div>
  );
}
