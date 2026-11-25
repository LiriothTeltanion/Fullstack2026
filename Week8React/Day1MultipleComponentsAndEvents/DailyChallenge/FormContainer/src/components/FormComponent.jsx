// Presentational: only displays what it receives in props.
function FormComponent({ data, query, onChange, onSubmit }) {
  const restrictions = [
    data.nutsFree && "Nuts free",
    data.lactoseFree && "Lactose free",
    data.vegan && "Vegan",
  ].filter(Boolean);

  return (
    <div className="layout">
      <form className="card form" onSubmit={onSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          value={data.firstName}
          onChange={onChange}
        />
        <input name="lastName" placeholder="Last Name" value={data.lastName} onChange={onChange} />
        <input
          name="age"
          type="number"
          min="0"
          placeholder="Age"
          value={data.age}
          onChange={onChange}
        />

        <fieldset>
          <legend>Gender</legend>
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={data.gender === "male"}
              onChange={onChange}
            />{" "}
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={data.gender === "female"}
              onChange={onChange}
            />{" "}
            Female
          </label>
        </fieldset>

        <label>
          Select your destination{" "}
          <select name="destination" value={data.destination} onChange={onChange}>
            <option value="">-- Please choose a destination --</option>
            <option value="Japan">Japan</option>
            <option value="Brazil">Brazil</option>
            <option value="Israel">Israel</option>
            <option value="Iceland">Iceland</option>
          </select>
        </label>

        <fieldset>
          <legend>Dietary restrictions</legend>
          <label>
            <input type="checkbox" name="nutsFree" checked={data.nutsFree} onChange={onChange} />{" "}
            Nuts free
          </label>
          <label>
            <input
              type="checkbox"
              name="lactoseFree"
              checked={data.lactoseFree}
              onChange={onChange}
            />{" "}
            Lactose free
          </label>
          <label>
            <input type="checkbox" name="vegan" checked={data.vegan} onChange={onChange} /> Vegan
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </form>

      <div className="card">
        <h2>Entered information</h2>
        <p>
          Your name: {data.firstName} {data.lastName}
        </p>
        <p>Your age: {data.age}</p>
        <p>Your gender: {data.gender}</p>
        <p>Your destination: {data.destination}</p>
        <p>Your dietary restrictions:</p>
        <ul>
          {restrictions.length ? (
            restrictions.map(item => <li key={item}>{item}</li>)
          ) : (
            <li className="muted">none</li>
          )}
        </ul>
        {query && (
          <p className="query">
            Sent as: <code>?{query}</code>
          </p>
        )}
      </div>
    </div>
  );
}

export default FormComponent;
