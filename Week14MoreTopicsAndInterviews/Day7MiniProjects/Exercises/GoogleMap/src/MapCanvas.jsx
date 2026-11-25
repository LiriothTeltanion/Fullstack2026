import { useEffect, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";

export default function MapCanvas({ center, apiKey }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "coordinate-map",
    googleMapsApiKey: apiKey,
  });
  const [authorizationError, setAuthorizationError] = useState(false);
  useEffect(() => {
    const previous = window.gm_authFailure;
    const handler = () => setAuthorizationError(true);
    window.gm_authFailure = handler;
    return () => {
      if (window.gm_authFailure === handler) window.gm_authFailure = previous;
    };
  }, []);
  if (authorizationError || loadError)
    return (
      <p role="alert" className="alert alert-danger">
        Google Maps could not load. Check the key, website restrictions and Maps JavaScript API
        access.
      </p>
    );
  if (!isLoaded) return <p role="status">Loading Google Maps...</p>;
  return (
    <GoogleMap
      mapContainerClassName="coordinate-map border rounded"
      center={center}
      zoom={13}
      options={{ gestureHandling: "cooperative", streetViewControl: false }}
    >
      <MarkerF position={center} title="Selected coordinates" />
    </GoogleMap>
  );
}
