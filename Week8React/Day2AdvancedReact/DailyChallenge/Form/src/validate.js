// Returns an object with one message per invalid field.
export function validate(values) {
  const errors = {};

  if (values.username.trim().length < 3) {
    errors.username = "Username needs at least 3 characters.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (values.password.length < 8 || !/\d/.test(values.password)) {
    errors.password = `Password needs ${8} characters and a number.`;
  }
  if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match.";
  }
  if (!values.terms) {
    errors.terms = "You must accept the terms.";
  }

  return errors;
}
