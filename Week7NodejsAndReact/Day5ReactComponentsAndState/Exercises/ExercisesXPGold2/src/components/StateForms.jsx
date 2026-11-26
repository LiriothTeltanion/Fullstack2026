import { useId, useRef, useState } from "react";
import {
  EMPTY_PRACTICE,
  EMPTY_PROFILE,
  TOPICS,
  practicePreview,
  profilePreview,
  validatePractice,
  validateProfile,
} from "../formState.js";

function FieldError({ id, children }) {
  return children ? (
    <p className="field-error" id={id}>
      {children}
    </p>
  ) : null;
}

// Every input has a React value/checked prop. Errors and the submitted snapshot
// are separate state: editing invalidates the old success message immediately.
function useForm(initialValues, validate, preview) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef(null);

  function change(event) {
    const { name, value, checked, type } = event.target;
    const next = { ...values, [name]: type === "checkbox" ? checked : value };
    setValues(next);
    setSubmitted(null);
    if (attempted) setErrors(validate(next));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setAttempted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setSubmitted(null);
      // The error order follows the form order, so correction starts naturally.
      formRef.current.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }
    setSubmitted(preview(values));
  }

  function reset() {
    setValues({ ...initialValues });
    setErrors({});
    setAttempted(false);
    setSubmitted(null);
    formRef.current.querySelector("input, select")?.focus();
  }

  return { values, errors, submitted, formRef, change, submit, reset };
}

export function ProfileForm() {
  const id = useId();
  const f = useForm(EMPTY_PROFILE, validateProfile, profilePreview);
  return (
    <section className="practice-card" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Profile form</h2>
      <p>Keep text in state, validate on submit, then show a submitted snapshot.</p>
      <form ref={f.formRef} onSubmit={f.submit} noValidate aria-label="Profile form">
        <div className="field">
          <label htmlFor={`${id}-name`}>Full name</label>
          <input
            id={`${id}-name`}
            name="fullName"
            autoComplete="name"
            required
            value={f.values.fullName}
            onChange={f.change}
            aria-invalid={Boolean(f.errors.fullName)}
            aria-describedby={f.errors.fullName ? `${id}-name-error` : undefined}
          />
          <FieldError id={`${id}-name-error`}>{f.errors.fullName}</FieldError>
        </div>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email address</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={f.values.email}
            onChange={f.change}
            aria-invalid={Boolean(f.errors.email)}
            aria-describedby={f.errors.email ? `${id}-email-error` : undefined}
          />
          <FieldError id={`${id}-email-error`}>{f.errors.email}</FieldError>
        </div>
        <div className="form-actions">
          <button type="submit">Preview profile</button>
          <button type="button" className="secondary" onClick={f.reset}>
            Reset profile
          </button>
        </div>
      </form>
      <div className="form-result" role="status" aria-live="polite" aria-atomic="true">
        {f.submitted && (
          <>
            <strong>Profile preview ready</strong>
            <dl>
              <dt>Name</dt>
              <dd>{f.submitted.fullName}</dd>
              <dt>Email</dt>
              <dd>{f.submitted.email}</dd>
            </dl>
          </>
        )}
      </div>
    </section>
  );
}

export function PracticeForm() {
  const id = useId();
  const f = useForm(EMPTY_PRACTICE, validatePractice, practicePreview);
  return (
    <section className="practice-card" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Practice preferences</h2>
      <p>One state object controls a select, radio buttons, a checkbox and notes.</p>
      <form ref={f.formRef} onSubmit={f.submit} noValidate aria-label="Practice preferences">
        <div className="field">
          <label htmlFor={`${id}-topic`}>Practice topic</label>
          <select
            id={`${id}-topic`}
            name="topic"
            value={f.values.topic}
            onChange={f.change}
            required
            aria-invalid={Boolean(f.errors.topic)}
            aria-describedby={f.errors.topic ? `${id}-topic-error` : undefined}
          >
            <option value="">Choose a topic</option>
            {TOPICS.map(topic => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
          <FieldError id={`${id}-topic-error`}>{f.errors.topic}</FieldError>
        </div>
        <fieldset>
          <legend>Practice pace</legend>
          <label className="choice">
            <input
              type="radio"
              name="pace"
              value="steady"
              checked={f.values.pace === "steady"}
              onChange={f.change}
            />
            Steady
          </label>
          <label className="choice">
            <input
              type="radio"
              name="pace"
              value="focused"
              checked={f.values.pace === "focused"}
              onChange={f.change}
            />
            Focused
          </label>
        </fieldset>
        <div className="field">
          <label htmlFor={`${id}-notes`}>Practice notes (optional)</label>
          <textarea
            id={`${id}-notes`}
            name="notes"
            rows="3"
            value={f.values.notes}
            onChange={f.change}
            aria-invalid={Boolean(f.errors.notes)}
            aria-describedby={`${id}-notes-hint${f.errors.notes ? ` ${id}-notes-error` : ""}`}
          />
          <small id={`${id}-notes-hint`}>Up to 300 Unicode characters after trimming.</small>
          <FieldError id={`${id}-notes-error`}>{f.errors.notes}</FieldError>
        </div>
        <label className="choice">
          <input
            type="checkbox"
            name="reminders"
            checked={f.values.reminders}
            onChange={f.change}
          />
          Include a reminder in this preview
        </label>
        <div className="form-actions">
          <button type="submit">Preview practice</button>
          <button type="button" className="secondary" onClick={f.reset}>
            Reset practice
          </button>
        </div>
      </form>
      <div className="form-result" role="status" aria-live="polite" aria-atomic="true">
        {f.submitted && (
          <>
            <strong>Practice preview ready</strong>
            <dl>
              <dt>Topic</dt>
              <dd>{f.submitted.topic}</dd>
              <dt>Pace</dt>
              <dd>{f.submitted.pace}</dd>
              <dt>Reminder</dt>
              <dd>{f.submitted.reminders ? "Included in preview" : "Not included"}</dd>
              <dt>Notes</dt>
              <dd>{f.submitted.notes || "No notes added."}</dd>
            </dl>
          </>
        )}
      </div>
    </section>
  );
}
