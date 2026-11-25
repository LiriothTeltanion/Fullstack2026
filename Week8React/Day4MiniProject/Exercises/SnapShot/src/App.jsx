import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Gallery from "./components/Gallery.jsx";
import { hasApiKey } from "./api/pexels.js";

function App() {
  return (
    <BrowserRouter>
      <main className="page">
        <Header />
        {!hasApiKey && (
          <p className="card error">
            Add VITE_PEXELS_API_KEY to a .env file (see .env.example) and restart npm run dev.
          </p>
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/mountain" replace />} />
          <Route path="/search/:query" element={<Gallery />} />
          <Route path="/:query" element={<Gallery />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
