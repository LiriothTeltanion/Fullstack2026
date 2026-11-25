// The text sits on top of the image with absolute positioning (see .meme-frame in App.css)
export default function MemePreview({ meme }) {
  if (!meme.imageUrl) {
    return <p className="loading">Loading templates…</p>;
  }

  const textStyle = { fontSize: `${meme.fontSize}px`, color: meme.color };

  return (
    <figure className="meme">
      <div className="meme-frame">
        <img src={meme.imageUrl} alt={`Meme template: ${meme.name}`} />
        <p className="meme-text top" style={textStyle}>
          {meme.topText}
        </p>
        <p className="meme-text bottom" style={textStyle}>
          {meme.bottomText}
        </p>
      </div>
      <figcaption>{meme.name}</figcaption>
    </figure>
  );
}
