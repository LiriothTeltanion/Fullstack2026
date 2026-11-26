import { useState } from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";

const rehearsalSet = ["Soundcheck", "Night Train", "Encore"];

function TrackList({ tracks }) {
  if (!Array.isArray(tracks)) {
    throw new Error("The selected set list has no track data.");
  }
  return (
    <ol>
      {tracks.map(track => (
        <li key={track}>{track}</li>
      ))}
    </ol>
  );
}

export default function SetListPreview() {
  const [unavailable, setUnavailable] = useState(false);

  return (
    <section className="card">
      <h2>Set list preview</h2>
      <p>Open the missing set list to see how the preview recovers from a render error.</p>
      <button
        type="button"
        onClick={event => {
          // A native dialog restores the element focused when it opened.
          event.currentTarget.focus({ preventScroll: true });
          setUnavailable(true);
        }}
      >
        Open missing set list
      </button>
      {/* A fresh boundary retries the preview with valid data after dismissal. */}
      <ErrorBoundary key={String(unavailable)} onRecover={() => setUnavailable(false)}>
        <TrackList tracks={unavailable ? undefined : rehearsalSet} />
      </ErrorBoundary>
    </section>
  );
}
