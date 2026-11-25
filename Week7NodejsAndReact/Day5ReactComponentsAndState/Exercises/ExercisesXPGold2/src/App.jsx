import { useState } from "react";
import Calculator from "./components/Calculator.jsx";
import ShoppingList from "./components/ShoppingList.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

// Exercise 3: the theme lives here (the parent) and the child only asks to change it.
export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <main className={theme}>
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme(t => (t === "light" ? "dark" : "light"))}
      />
      <section>
        <h2>Exercise 1 · Calculator</h2>
        <Calculator />
      </section>
      <section>
        <h2>Exercise 2 · Shopping list</h2>
        <ShoppingList />
      </section>
    </main>
  );
}
