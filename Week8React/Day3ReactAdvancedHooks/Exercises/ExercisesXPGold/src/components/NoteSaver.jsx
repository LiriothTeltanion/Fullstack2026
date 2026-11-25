import { useLocalStorage } from "../hooks/useLocalStorage.js";

function NoteSaver() {
  const [note, setNote] = useLocalStorage("gold-note", "");

  return (
    <div>
      <textarea
        rows="3"
        cols="40"
        value={note}
        onChange={event => setNote(event.target.value)}
        placeholder="Write something, then reload the page"
      />
      <p className="muted">{note.length} characters saved in localStorage.</p>
    </div>
  );
}

export default NoteSaver;
