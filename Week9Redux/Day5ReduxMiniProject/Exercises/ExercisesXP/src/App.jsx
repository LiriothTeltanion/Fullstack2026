import BookList from "./features/books/BookList.jsx";
import CategorySummary from "./features/expenses/CategorySummary.jsx";
import ExpenseForm from "./features/expenses/ExpenseForm.jsx";
import ExpenseList from "./features/expenses/ExpenseList.jsx";

export default function App() {
  return (
    <main>
      <h1>Book inventory and expense tracker</h1>
      <BookList />
      <section className="card">
        <h2>New expense</h2>
        <ExpenseForm editing={null} />
      </section>
      <ExpenseList />
      <CategorySummary />
    </main>
  );
}
