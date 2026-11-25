import { useCallback, useEffect, useState } from "react";
import TipCard from "./components/TipCard.jsx";
import ServerStatus from "./components/ServerStatus.jsx";

// Empty locally (the Vite proxy handles /api); the API URL on Render
const API_URL = import.meta.env.VITE_API_URL || "";

export default function App() {
  const [tip, setTip] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTip = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/tips/random`);
      if (!response.ok) throw new Error(`Server answered ${response.status}`);
      setTip(await response.json());
    } catch (err) {
      // A sleeping free service can take ~30 seconds to wake up
      setError(`${err.message}. If the API was asleep, try again in a few seconds.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTip();
  }, [loadTip]);

  return (
    <main className="app">
      <header>
        <p className="eyebrow">React on a Render static site · Express on a Render web service</p>
        <h1>Deploy Tips</h1>
      </header>

      <TipCard tip={tip} loading={loading} error={error} onNext={loadTip} />
      <ServerStatus apiUrl={API_URL} />
    </main>
  );
}
