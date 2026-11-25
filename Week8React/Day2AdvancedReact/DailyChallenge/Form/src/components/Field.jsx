function Field({ label, name, type = "text", value, error, onChange, onBlur }) {
  return (
    <label className="field">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
      />
      {error && <span className="error">{error}</span>}
    </label>
  );
}

export default Field;
