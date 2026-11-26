import { useState } from "react";

export default function ImageColumn() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadLocalIllustrations() {
    const response = await fetch(`${import.meta.env.BASE_URL}images.json`);
    if (!response.ok) throw new Error("Local image request failed");
    const data = await response.json();
    if (
      !Array.isArray(data.images) ||
      data.images.length !== 2 ||
      data.images.some(
        image =>
          typeof image.src !== "string" ||
          !/^images\/[a-z-]+\.svg$/.test(image.src) ||
          typeof image.alt !== "string" ||
          !image.alt.trim() ||
          typeof image.title !== "string"
      )
    )
      throw new Error("Invalid local image response");
    setImages(
      data.images.map(image => ({
        ...image,
        src: `${import.meta.env.BASE_URL}${image.src}`,
        local: true,
      }))
    );
    setNotice("Image service unavailable. Showing original local illustrations.");
  }

  async function loadImages() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      // The public image API needs no key. Bound its duration so the labelled
      // local fallback can keep the recovery exercise usable during an outage.
      const response = await fetch("https://picsum.photos/v2/list?page=0&limit=2", {
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Image service request failed");
      const data = await response.json();
      if (
        !Array.isArray(data) ||
        data.length !== 2 ||
        data.some(
          image =>
            !/^\d+$/.test(String(image.id)) ||
            typeof image.author !== "string" ||
            !image.author.trim()
        )
      )
        throw new Error("Invalid image service response");
      setImages(
        data.map(image => ({
          src: `https://picsum.photos/id/${image.id}/640/360`,
          alt: `Photograph by ${image.author}`,
          title: `Photo by ${image.author} · Lorem Picsum`,
          local: false,
        }))
      );
    } catch {
      try {
        await loadLocalIllustrations();
      } catch {
        setError("The images could not load. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="practice-card image-column" aria-labelledby="image-heading">
      <h2 id="image-heading">A view that stays.</h2>
      <p>
        Load two photographs from Lorem Picsum. The image column stays available when the
        neighboring paragraph fails.
      </p>
      <button onClick={loadImages} disabled={loading}>
        {loading ? "Loading images…" : "Get images"}
      </button>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      <div className="illustrations" aria-busy={loading}>
        {images.length ? (
          images.map(image => (
            <figure key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                width="640"
                height="360"
                onError={() => {
                  if (!image.local)
                    loadLocalIllustrations().catch(() =>
                      setError("The images could not load. Please try again.")
                    );
                }}
              />
              <figcaption>{image.title}</figcaption>
            </figure>
          ))
        ) : (
          <div className="image-placeholder">
            <span aria-hidden="true">↗</span>
            <p>Your images will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
