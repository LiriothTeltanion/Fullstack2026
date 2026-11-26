// The text sits on top of the image with absolute positioning (see .meme-frame in App.css)
export default function MemePreview({ meme, onImageError }) {
  // The chosen size is an upper bound: small previews also cap it by width.
  const textStyle = { "--meme-font-size": `${meme.fontSize}px`, color: meme.color };

  return (
    <figure className="meme-preview">
      <div className="meme meme-frame">
        <img
          src={meme.randomImage}
          alt={`Meme template: ${meme.name}`}
          className={meme.imageError ? "is-unavailable" : undefined}
          onError={onImageError}
        />
        <h2 className="meme-text top" style={textStyle}>
          {meme.topText}
        </h2>
        <h2 className="meme-text bottom" style={textStyle}>
          {meme.bottomText}
        </h2>
      </div>
      <figcaption>{meme.name}</figcaption>
    </figure>
  );
}
