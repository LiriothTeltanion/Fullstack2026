import Header from "./components/Header.jsx";
import MemeGenerator from "./components/MemeGenerator.jsx";
import "./App.css";

export default function App() {
  return (
    <>
      <Header />
      <main className="layout">
        <h1 className="visually-hidden">Create a captioned meme</h1>
        <MemeGenerator />
      </main>
    </>
  );
}
