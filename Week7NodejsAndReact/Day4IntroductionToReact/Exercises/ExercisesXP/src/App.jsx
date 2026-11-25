import HelloJsx from "./components/HelloJsx.jsx";
import UserFavoriteAnimals from "./components/UserFavoriteAnimals.jsx";
import Exercise from "./components/Exercise.jsx";

// Exercise 2: a plain object read inside JSX with { }
const user = {
  firstName: "Bob",
  lastName: "Dylan",
  favAnimals: ["Horse", "Turtle", "Elephant", "Monkey"],
};

export default function App() {
  return (
    <main>
      <section>
        <h2>Exercise 1 · JSX</h2>
        <HelloJsx />
      </section>

      <section>
        <h2>Exercise 2 · Objects</h2>
        <h3>{user.firstName}</h3>
        <h3>{user.lastName}</h3>
        <UserFavoriteAnimals favAnimals={user.favAnimals} />
      </section>

      <section>
        <h2>Exercise 3 · HTML tags in React</h2>
        <Exercise />
      </section>
    </main>
  );
}
