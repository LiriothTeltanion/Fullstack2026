import { ThemeProvider } from "./context/ThemeContext.jsx";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";
import CharacterCounter from "./components/CharacterCounter.jsx";
import TodoList from "./components/TodoList.jsx";

function App() {
  return (
    <ThemeProvider>
      <main className="page">
        <h1>Week 8 Day 3 · Exercises XP</h1>

        <section className="card">
          <h2>Exercise 1 · Theme switcher with useContext</h2>
          <ThemeSwitcher />
        </section>

        <section className="card">
          <h2>Exercise 2 · Character counter with useRef</h2>
          <CharacterCounter />
        </section>

        <section className="card">
          <h2>Exercise 3 · Todo list with useReducer</h2>
          <TodoList />
        </section>
      </main>
    </ThemeProvider>
  );
}

export default App;
