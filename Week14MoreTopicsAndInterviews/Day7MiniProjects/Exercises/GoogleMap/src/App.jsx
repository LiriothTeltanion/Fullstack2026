import { useId, useRef, useState } from "react";
import MapCanvas from "./MapCanvas.jsx";
import { coordinateFields, parseCoordinates } from "./coordinates.js";

const cityCenter = { lat: 31.2518, lng: 34.7913 };
export default function App() {
  const [latitude, setLatitude] = useState(String(cityCenter.lat));
  const [longitude, setLongitude] = useState(String(cityCenter.lng));
  const [center, setCenter] = useState(cityCenter);
  const [error, setError] = useState(null);
  const formId = useId();
  const inputs = useRef({});
  const errorId = `${formId}-error`;
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const configured = apiKey && !apiKey.startsWith("replace-");
  function handleSubmit(event) {
    event.preventDefault();
    const result = parseCoordinates(latitude, longitude);
    if (result.error) {
      setError(result);
      inputs.current[result.field]?.focus();
      return;
    }
    setError(null);
    setCenter(result);
  }

  return (
    <main className="container py-4">
      <h1 className="mb-3">Coordinates on Google Maps</h1>
      <p className="text-secondary">
        Choose latitude and longitude to center the map and move its marker.
      </p>
      <form className="row g-3 mb-3" onSubmit={handleSubmit} noValidate>
        {coordinateFields.map(({ name, label, min, max }) => {
          const invalid = error?.field === name;
          return (
            <div className="col-md-5" key={name}>
              <label htmlFor={`${formId}-${name}`} className="form-label">
                {label}
              </label>
              <input
                ref={element => {
                  inputs.current[name] = element;
                }}
                id={`${formId}-${name}`}
                name={name}
                className={`form-control${invalid ? " is-invalid" : ""}`}
                type="number"
                step="any"
                min={min}
                max={max}
                required
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                value={name === "latitude" ? latitude : longitude}
                onChange={event => {
                  (name === "latitude" ? setLatitude : setLongitude)(event.target.value);
                  if (invalid) setError(null);
                }}
              />
            </div>
          );
        })}
        <div className="col-md-2 align-self-end">
          <button type="submit" className="btn btn-primary w-100">
            Show location
          </button>
        </div>
      </form>
      {error && (
        <p id={errorId} role="alert" className="alert alert-danger">
          {error.error}
        </p>
      )}
      <p role="status">
        Selected location: {center.lat}, {center.lng}
      </p>
      {configured ? (
        <MapCanvas center={center} apiKey={apiKey} />
      ) : (
        <div className="alert alert-warning">
          Set VITE_GOOGLE_MAPS_API_KEY in .env.local and restart Vite to load the map. Use your own
          website-restricted Maps JavaScript API key or a Maps Demo Key.
        </div>
      )}
      <p className="mt-3">
        <a
          href={
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent(center.lat + "," + center.lng)
          }
          target="_blank"
          rel="noreferrer"
        >
          Open selected coordinates in Google Maps
        </a>
      </p>
    </main>
  );
}
