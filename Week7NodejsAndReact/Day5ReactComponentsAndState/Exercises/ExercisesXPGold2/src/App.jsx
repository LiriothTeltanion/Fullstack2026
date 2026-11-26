import { useState } from "react";
import Calculator from "./components/Calculator.jsx";
import ShoppingList from "./components/ShoppingList.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { PracticeForm, ProfileForm } from "./components/StateForms.jsx";
import "./forms.css";

// Exercise 3: the theme lives here (the parent) and the child only asks to change it.
export default function App() {
  const [theme, setTheme] = useState("light");

  return (
    <main className={theme}>
      <ThemeToggle
        theme={theme}
        onToggle={() => setTheme(t => (t === "light" ? "dark" : "light"))}
      />
      <header className="practice-intro">
        <h1>React & Forms</h1>
        <p>Two controlled forms: edit, validate and preview. Nothing is sent or stored.</p>
      </header>
      <div className="forms-grid">
        <ProfileForm />
        <PracticeForm />
      </div>
      <h2>More state practice</h2>
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
