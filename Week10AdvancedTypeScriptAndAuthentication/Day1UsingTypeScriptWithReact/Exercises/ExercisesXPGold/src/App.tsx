import ShoppingList from "./components/ShoppingList";
import ThemeToggle from "./components/ThemeToggle";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function App() {
  const [name, setName] = useLocalStorage(
    "gold-name",
    "",
    (saved): saved is string => typeof saved === "string"
  );

  return (
    <main>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h1>Hi{name ? `, ${name}` : ""}</h1>
        <ThemeToggle />
      </div>
      <section className="card">
        <label className="row">
          Your name (saved with useLocalStorage&lt;string&gt;):
          <input value={name} onChange={event => setName(event.target.value)} />
        </label>
      </section>
      <ShoppingList />
    </main>
  );
}
