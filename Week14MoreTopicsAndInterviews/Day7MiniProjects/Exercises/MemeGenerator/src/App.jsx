import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import MemeForm from "./components/MemeForm.jsx";
import MemePreview from "./components/MemePreview.jsx";

const MEMES_URL = "https://api.imgflip.com/get_memes";

export default function App() {
  // All the templates from the API, loaded once
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState("");
  // The meme being edited: text, style and the chosen image
  const [meme, setMeme] = useState({
    topText: "When the code works",
    bottomText: "on the first try",
    fontSize: 40,
    color: "#ffffff",
    imageUrl: "",
    name: "",
  });

  useEffect(() => {
    fetch(MEMES_URL)
      .then(response => response.json())
      .then(data => {
        if (!data.success) throw new Error("The meme API said no.");
        setTemplates(data.data.memes);
        // Start with the first template so the page is never empty
        const first = data.data.memes[0];
        setMeme(current => ({ ...current, imageUrl: first.url, name: first.name }));
      })
      .catch(err => setError(err.message || "Could not load meme templates."));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme(current => ({ ...current, [name]: name === "fontSize" ? Number(value) : value }));
  }

  function pickRandomImage() {
    const random = templates[Math.floor(Math.random() * templates.length)];
    setMeme(current => ({ ...current, imageUrl: random.url, name: random.name }));
  }

  return (
    <>
      <Header />
      <main className="layout">
        <MemeForm
          meme={meme}
          onChange={handleChange}
          onRandom={pickRandomImage}
          disabled={templates.length === 0}
        />
        {error ? <p className="error">{error}</p> : <MemePreview meme={meme} />}
      </main>
    </>
  );
}
