// Controlled inputs: every value comes from the MemeGenerator class state.
export default function MemeForm({ meme, onChange, onRandom, onRetry, disabled }) {
  const showRetry = Boolean(meme.error);
  return (
    <form className="form" onSubmit={event => event.preventDefault()}>
      <label>
        Top text
        <input name="topText" value={meme.topText} onChange={onChange} maxLength={80} />
      </label>
      <label>
        Bottom text
        <input name="bottomText" value={meme.bottomText} onChange={onChange} maxLength={80} />
      </label>
      <div className="row">
        <label>
          Maximum size: {meme.fontSize}px
          <input
            name="fontSize"
            type="range"
            min="20"
            max="72"
            value={meme.fontSize}
            onChange={onChange}
          />
        </label>
        <label>
          Color
          <input name="color" type="color" value={meme.color} onChange={onChange} />
        </label>
      </div>
      <button
        type="button"
        onClick={showRetry ? onRetry : onRandom}
        disabled={disabled && !showRetry}
        aria-disabled={showRetry && meme.loading ? true : undefined}
      >
        {showRetry ? "Retry templates" : "Gen"}
      </button>
    </form>
  );
}
