import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchForm() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    if (!term.trim()) return;
    navigate(`/search/${encodeURIComponent(term.trim())}`);
    setTerm("");
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        value={term}
        onChange={event => setTerm(event.target.value)}
        placeholder="Search..."
        aria-label="Search photos"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchForm;
