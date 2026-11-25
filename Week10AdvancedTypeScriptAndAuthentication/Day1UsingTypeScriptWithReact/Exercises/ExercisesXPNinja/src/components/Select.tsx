// Exercise 4: a generic select. `value` and `onChange` use the option type, not strings.
interface SelectProps<T> {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
  getLabel: (option: T) => string;
}

export default function Select<T>({ label, options, value, onChange, getLabel }: SelectProps<T>) {
  return (
    <label className="row">
      {label}
      <select
        value={options.indexOf(value)}
        onChange={event => onChange(options[Number(event.target.value)])}
      >
        {options.map((option, index) => (
          <option key={index} value={index}>
            {getLabel(option)}
          </option>
        ))}
      </select>
    </label>
  );
}
