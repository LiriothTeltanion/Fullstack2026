import CategorySummary from "./features/expenses/CategorySummary.jsx";
import ExpenseForm from "./features/expenses/ExpenseForm.jsx";
import ExpenseList from "./features/expenses/ExpenseList.jsx";

export default function App() {
  return (
    <main>
      <h1>Expense tracker</h1>
      <section className="card">
        <h2>New expense</h2>
        <ExpenseForm editing={null} />
      </section>
      <ExpenseList />
      <CategorySummary />
    </main>
  );
}
