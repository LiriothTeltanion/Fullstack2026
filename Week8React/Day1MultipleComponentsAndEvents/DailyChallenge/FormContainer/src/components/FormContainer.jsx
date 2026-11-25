import { useState } from "react";
import FormComponent from "./FormComponent.jsx";

const emptyForm = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  destination: "",
  nutsFree: false,
  lactoseFree: false,
  vegan: false,
};

// Container: owns the state and the handlers, renders no markup of its own.
function FormContainer() {
  const [data, setData] = useState(emptyForm);
  const [query, setQuery] = useState("");

  const handleChange = event => {
    const { name, value, type, checked } = event.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Build the same query string a GET form would send.
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value === true) params.append(key, "on");
      else if (value) params.append(key, value);
    });
    setQuery(params.toString());
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  return (
    <FormComponent data={data} query={query} onChange={handleChange} onSubmit={handleSubmit} />
  );
}

export default FormContainer;
