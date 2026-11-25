import { useState } from "react";
import LanguageRow from "./components/LanguageRow.jsx";

const startingLanguages = [
  { name: "Php", votes: 0 },
  { name: "Python", votes: 0 },
  { name: "JavaScript", votes: 0 },
  { name: "Java", votes: 0 },
];

export default function App() {
  const [languages, setLanguages] = useState(startingLanguages);

  // State is never changed in place: map() builds a new array with one new object.
  function addVote(name) {
    setLanguages(current =>
      current.map(lang => (lang.name === name ? { ...lang, votes: lang.votes + 1 } : lang))
    );
  }

  const total = languages.reduce((sum, lang) => sum + lang.votes, 0);
  const topVotes = Math.max(...languages.map(lang => lang.votes));

  return (
    <main>
      <h1>Vote Your Language!</h1>
      <ul className="languages">
        {languages.map(lang => (
          <LanguageRow
            key={lang.name}
            language={lang}
            percent={total ? Math.round((lang.votes / total) * 100) : 0}
            leading={total > 0 && lang.votes === topVotes}
            onVote={addVote}
          />
        ))}
      </ul>
      <p className="total">Total votes: {total}</p>
      <button
        className="reset"
        onClick={() => setLanguages(startingLanguages)}
        disabled={total === 0}
      >
        Reset votes
      </button>
    </main>
  );
}
