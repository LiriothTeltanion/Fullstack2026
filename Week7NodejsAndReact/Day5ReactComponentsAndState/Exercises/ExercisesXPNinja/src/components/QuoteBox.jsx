export default function QuoteBox({ quote, color, onNext }) {
  return (
    <figure className="quote-box">
      <blockquote style={{ color }}>“{quote.text}”</blockquote>
      <figcaption style={{ color }}>— {quote.author}</figcaption>
      <button style={{ backgroundColor: color }} onClick={onNext}>
        New quote
      </button>
    </figure>
  );
}
