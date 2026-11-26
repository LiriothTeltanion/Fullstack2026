import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { hasApiKey, searchPhotos } from "../api/pexels.js";
import { getPhotoQuery } from "../gallerySettings.js";

function Gallery() {
  // The same component serves /mountain and /search/anything.
  const { pathname } = useLocation();
  const query = getPhotoQuery(pathname);
  const queryError =
    query === null
      ? "This URL contains invalid percent encoding. Try another search."
      : !query.trim()
        ? "Enter a search term."
        : "";
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasApiKey || queryError) {
      setLoading(false);
      setError("");
      return;
    }
    let ignore = false;
    setLoading(true);
    setError("");
    searchPhotos(query)
      .then(results => !ignore && setPhotos(results))
      .catch(err => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => {
      ignore = true;
    };
  }, [query, queryError]);

  if (queryError) return <p className="error" role="alert">{queryError}</p>;
  if (loading) return <p className="muted">Loading {query} pictures…</p>;
  if (error) return <p className="error" role="alert">{error}</p>;

  return (
    <section>
      <h2 className="gallery-title">{query} pictures</h2>
      {photos.length === 0 && hasApiKey ? (
        <p className="muted">No images found for “{query}”.</p>
      ) : (
        <ul className="gallery">
          {photos.map(photo => (
            <li key={photo.id}>
              <a href={photo.url} target="_blank" rel="noreferrer">
                <img src={photo.src.medium} alt={photo.alt || query} loading="lazy" />
              </a>
              {photo.photographer && <span className="credit">{photo.photographer}</span>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Gallery;
