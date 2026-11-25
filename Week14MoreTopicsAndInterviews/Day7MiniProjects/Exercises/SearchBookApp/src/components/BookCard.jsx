import { publishedYear } from "../books.js";

export default function BookCard({ volumeInfo }) {
  const { title = "Untitled", authors = [], imageLinks } = volumeInfo;
  const year = publishedYear(volumeInfo);
  // Google sends http:// thumbnails; https avoids mixed-content warnings
  const cover = imageLinks?.thumbnail?.replace(/^http:\/\//, "https://");

  return (
    <article className="book-card">
      {cover ? (
        <img src={cover} alt={`Cover of ${title}`} loading="lazy" />
      ) : (
        <div className="no-cover" aria-hidden="true">
          📖
        </div>
      )}
      <h2>{title}</h2>
      <p className="authors">{authors.length > 0 ? authors.join(", ") : "Unknown author"}</p>
      <p className="year">{year > 0 ? year : "Year unknown"}</p>
    </article>
  );
}
