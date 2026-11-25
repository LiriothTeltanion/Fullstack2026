import { useState } from "react";

function Phone() {
  const [phone, setPhone] = useState({
    brand: "Samsung",
    model: "Galaxy S20",
    color: "black",
    year: 2020,
  });

  const changeColor = () => {
    // Copy the object and change only one key.
    setPhone({ ...phone, color: "blue" });
  };

  return (
    <div>
      <p>My phone is a {phone.brand}</p>
      <p>
        It is a {phone.color} {phone.model} from {phone.year}
      </p>
      <button onClick={changeColor}>Change color</button>
    </div>
  );
}

export default Phone;
