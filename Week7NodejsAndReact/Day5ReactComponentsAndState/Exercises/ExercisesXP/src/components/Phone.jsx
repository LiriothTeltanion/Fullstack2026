import { useState } from "react";

// Exercise 3: one state object; the spread keeps the other fields.
export default function Phone() {
  const [phone, setPhone] = useState({
    brand: "Samsung",
    model: "Galaxy S20",
    color: "black",
    year: 2020,
  });

  const changeColor = () => setPhone(current => ({ ...current, color: "blue" }));

  return (
    <div>
      <h3>My phone is a {phone.brand}</h3>
      <p>
        It is a {phone.color} {phone.model} from {phone.year}
      </p>
      <button onClick={changeColor}>Change color</button>
    </div>
  );
}
