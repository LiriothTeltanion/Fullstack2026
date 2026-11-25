export default function TipCard({ tip, loading, error, onNext }) {
  return (
    <section className="card" aria-live="polite">
      {loading && <p className="muted">Loading a tip…</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && tip && (
        <blockquote>
          <span className="tip-number">Tip #{tip.id}</span>
          <p>{tip.text}</p>
        </blockquote>
      )}
      <button type="button" onClick={onNext} disabled={loading}>
        Another tip
      </button>
    </section>
  );
}
