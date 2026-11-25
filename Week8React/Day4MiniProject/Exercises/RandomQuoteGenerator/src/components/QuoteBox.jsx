function QuoteBox({ quote, color, onNewQuote }) {
  return (
    <figure className="quote-box">
      <blockquote style={{ color }}>“{quote.quote}”</blockquote>
      <figcaption style={{ color }}>- {quote.author}</figcaption>
      <button style={{ backgroundColor: color, borderColor: color }} onClick={onNewQuote}>
        New quote
      </button>
    </figure>
  );
}

export default QuoteBox;
