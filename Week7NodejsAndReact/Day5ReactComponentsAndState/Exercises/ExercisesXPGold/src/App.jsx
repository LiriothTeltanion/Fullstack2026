import Counter from "./components/Counter.jsx";
import SignupForm from "./components/SignupForm.jsx";
import ShowHide from "./components/ShowHide.jsx";

export default function App() {
  return (
    <main>
      <section>
        <h2>Exercise 1 · Counter with limits</h2>
        <Counter min={0} max={10} />
      </section>
      <section>
        <h2>Exercise 2 · Controlled form</h2>
        <SignupForm />
      </section>
      <section>
        <h2>Exercise 3 · Mount and unmount</h2>
        <ShowHide />
      </section>
    </main>
  );
}
