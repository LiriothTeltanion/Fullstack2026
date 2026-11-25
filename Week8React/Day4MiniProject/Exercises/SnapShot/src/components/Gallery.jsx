import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { hasApiKey, searchPhotos } from "../api/pexels.js";

function Gallery() {
  // The same component serves /mountain and /search/anything.
  const { query } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasApiKey) return;
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
  }, [query]);

  if (loading) return <p className="muted">Loading {query} pictures…</p>;
  if (error) return <p className="error">{error}</p>;

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
              <span className="credit">{photo.photographer}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Gallery;
