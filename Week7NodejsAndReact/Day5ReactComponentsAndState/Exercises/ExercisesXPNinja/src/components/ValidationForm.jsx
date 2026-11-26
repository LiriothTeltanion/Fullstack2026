import { useId, useRef, useState } from "react";
import { FIELD_DEFINITIONS, FIELD_ORDER, validateProfile } from "../formValidation.js";

const empty = { fullName: "", email: "", password: "", confirmPassword: "" };

export default function ValidationForm() {
  const id = useId();
  const inputs = useRef({});
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const result = validateProfile(values);
  const errors = Object.fromEntries(
    Object.entries(result.errors).filter(([field]) => attempted || touched[field])
  );

  function change(event) {
    setValues(current => ({ ...current, [event.target.name]: event.target.value }));
    setPreview(null);
  }

  function submit(event) {
    event.preventDefault();
    setAttempted(true);
    if (!result.valid) {
      inputs.current[FIELD_ORDER.find(field => result.errors[field])]?.focus();
      return;
    }
    setPreview(result.preview);
    setValues(current => ({ ...current, password: "", confirmPassword: "" }));
    setTouched({});
    setAttempted(false);
    setShowPassword(false);
  }

  function reset() {
    setValues(empty);
    setTouched({});
    setAttempted(false);
    setShowPassword(false);
    setPreview(null);
    inputs.current.fullName?.focus();
  }

  return (
    <section className="validation-card" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Validate a local profile</h2>
      <p className="form-intro">
        Practice your form checks with invented details. No account is created, and nothing is sent
        or saved.
      </p>
      <form noValidate onSubmit={submit}>
        {FIELD_DEFINITIONS.map(definition => {
          const field = definition.name;
          const error = errors[field];
          let type = definition.type;
          if (field === "password" && showPassword) type = "text";
          return (
            <div className="practice-field" key={field}>
              <label htmlFor={`${id}-${field}`}>{definition.label}</label>
              <div className={field === "password" ? "practice-password" : undefined}>
                <input
                  ref={element => {
                    inputs.current[field] = element;
                  }}
                  id={`${id}-${field}`}
                  name={field}
                  type={type}
                  autoComplete={definition.autoComplete}
                  value={values[field]}
                  onChange={change}
                  onBlur={() => setTouched(current => ({ ...current, [field]: true }))}
                  required
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${id}-${field}-hint${error ? ` ${id}-${field}-error` : ""}`}
                />
                {field === "password" && (
                  <button
                    className="password-toggle"
                    type="button"
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(current => !current)}
                  >
                    {showPassword ? "Hide" : "Show"}
                    <span className="sr-only"> practice password</span>
                  </button>
                )}
              </div>
              <p className="practice-hint" id={`${id}-${field}-hint`}>
                {definition.hint}
              </p>
              {error && (
                <p className="field-error" id={`${id}-${field}-error`}>
                  {error}
                </p>
              )}
            </div>
          );
        })}
        <p className="validation-summary" role="alert">
          {attempted && !result.valid ? "Check the highlighted fields, then try again." : ""}
        </p>
        <div className="practice-actions">
          <button type="submit">Validate profile</button>
          <button type="button" className="reset-form" onClick={reset}>
            Reset form
          </button>
        </div>
        <div className="profile-preview" role="status" aria-live="polite">
          {preview && (
            <>
              <h3>Local preview ready</h3>
              <p>
                <strong>Name:</strong> <bdi>{preview.fullName}</bdi>
              </p>
              <p>
                <strong>Email:</strong> <bdi>{preview.email}</bdi>
              </p>
              <p>Both password fields have been cleared.</p>
            </>
          )}
        </div>
      </form>
    </section>
  );
}
