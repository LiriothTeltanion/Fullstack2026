import { useState } from "react";
import TemperatureInput from "./TemperatureInput.jsx";

const toCelsius = f => ((f - 32) * 5) / 9;
const toFahrenheit = c => (c * 9) / 5 + 32;

function convert(value, converter) {
  const number = parseFloat(value);
  if (Number.isNaN(number)) return "";
  return String(Math.round(converter(number) * 10) / 10);
}

function TemperatureConverter() {
  // One source of truth: the last value typed and its scale.
  const [temperature, setTemperature] = useState("");
  const [scale, setScale] = useState("c");

  const celsius = scale === "f" ? convert(temperature, toCelsius) : temperature;
  const fahrenheit = scale === "c" ? convert(temperature, toFahrenheit) : temperature;

  return (
    <div className="row">
      <TemperatureInput
        label="Celsius"
        value={celsius}
        onChange={value => {
          setScale("c");
          setTemperature(value);
        }}
      />
      <TemperatureInput
        label="Fahrenheit"
        value={fahrenheit}
        onChange={value => {
          setScale("f");
          setTemperature(value);
        }}
      />
      {celsius !== "" && Number(celsius) >= 100 && <p>The water would boil.</p>}
    </div>
  );
}

export default TemperatureConverter;
