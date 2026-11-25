import BookCard from "./BookCard.jsx";

export default function BookList({ books }) {
  if (books.length === 0) return null;
  return (
    <ul className="book-list">
      {books.map(book => (
        <li key={book.id}>
          <BookCard volumeInfo={book.volumeInfo} />
        </li>
      ))}
    </ul>
  );
}
