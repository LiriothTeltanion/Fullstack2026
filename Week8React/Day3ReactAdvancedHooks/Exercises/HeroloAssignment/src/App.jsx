import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext.jsx";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";

function App() {
  return (
    <WeatherProvider>
      <BrowserRouter>
        <Header />
        <main className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </BrowserRouter>
    </WeatherProvider>
  );
}

export default App;
