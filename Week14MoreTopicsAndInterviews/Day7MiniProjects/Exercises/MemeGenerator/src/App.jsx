import Header from "./components/Header.jsx";
import MemeGenerator from "./components/MemeGenerator.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="layout">
        <MemeGenerator />
      </main>
    </>
  );
}
