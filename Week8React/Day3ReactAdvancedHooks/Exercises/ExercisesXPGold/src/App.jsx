import { CartProvider } from "./context/CartContext.jsx";
import ProductList from "./components/ProductList.jsx";
import Cart from "./components/Cart.jsx";
import NoteSaver from "./components/NoteSaver.jsx";
import PreviousValue from "./components/PreviousValue.jsx";

function App() {
  return (
    <main className="page">
      <h1>Week 8 Day 3 · Exercises XP Gold</h1>

      <section className="card">
        <h2>Exercise 1 · Shopping cart with useReducer and useContext</h2>
        <CartProvider>
          <div className="shop">
            <ProductList />
            <Cart />
          </div>
        </CartProvider>
      </section>

      <section className="card">
        <h2>Exercise 2 · A useLocalStorage hook</h2>
        <NoteSaver />
      </section>

      <section className="card">
        <h2>Exercise 3 · A usePrevious hook</h2>
        <PreviousValue />
      </section>
    </main>
  );
}

export default App;
