function TemperatureInput({ label, value, onChange }) {
  return (
    <label>
      {label} <input type="number" value={value} onChange={event => onChange(event.target.value)} />
    </label>
  );
}

export default TemperatureInput;
