import Cart from "./components/Cart.jsx";
import CouponForm from "./components/CouponForm.jsx";
import ProductList from "./components/ProductList.jsx";

export default function App() {
  return (
    <main>
      <h1>Stationery shop</h1>
      <ProductList />
      <Cart />
      <CouponForm />
    </main>
  );
}
