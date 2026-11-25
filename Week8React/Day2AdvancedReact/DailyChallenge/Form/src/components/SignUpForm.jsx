import { useState } from "react";
import Field from "./Field.jsx";
import { validate } from "../validate.js";

const initialValues = {
  username: "",
  email: "",
  password: "",
  confirm: "",
  terms: false,
};

function SignUpForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  };

  // An error only shows after the user has left the field once.
  const handleBlur = event => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const handleSubmit = event => {
    event.preventDefault();
    setTouched({ username: true, email: true, password: true, confirm: true, terms: true });
    if (!isValid) return;
    setSubmitted({ username: values.username, email: values.email });
    setValues(initialValues);
    setTouched({});
  };

  const show = name => (touched[name] ? errors[name] : "");

  return (
    <>
      <form className="card form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Username"
          name="username"
          value={values.username}
          error={show("username")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          value={values.email}
          error={show("email")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          value={values.password}
          error={show("password")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          value={values.confirm}
          error={show("confirm")}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label>
          <input
            type="checkbox"
            name="terms"
            checked={values.terms}
            onChange={handleChange}
            onBlur={handleBlur}
          />{" "}
          I accept the terms
        </label>
        {show("terms") && <span className="error">{errors.terms}</span>}
        <button type="submit">Sign up</button>
      </form>

      {submitted && (
        <p className="card success">
          Welcome, {submitted.username}. A confirmation would go to {submitted.email}.
        </p>
      )}
    </>
  );
}

export default SignUpForm;
