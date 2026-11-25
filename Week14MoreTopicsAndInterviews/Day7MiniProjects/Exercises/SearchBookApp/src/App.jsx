import Book from "./components/Book.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Book />
      </main>
    </div>
  );
}
