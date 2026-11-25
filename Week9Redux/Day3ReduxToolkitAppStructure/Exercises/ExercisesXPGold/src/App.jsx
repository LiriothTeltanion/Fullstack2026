import BookForm from "./features/books/BookForm.jsx";
import BookList from "./features/books/BookList.jsx";

export default function App() {
  return (
    <main>
      <h1>Book inventory</h1>
      <BookList />
      <BookForm />
    </main>
  );
}
