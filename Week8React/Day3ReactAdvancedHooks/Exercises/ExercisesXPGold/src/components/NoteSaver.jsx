import { useLocalStorage } from "../hooks/useLocalStorage.js";

const isText = value => typeof value === "string";

function NoteSaver() {
  const [note, setNote, storageError] = useLocalStorage("gold-note", "", isText);

  return (
    <div>
      <textarea
        rows="3"
        cols="40"
        style={{ maxWidth: "100%" }}
        value={note}
        onChange={event => setNote(event.target.value)}
        placeholder="Write something, then reload the page"
      />
      <p className="muted" role="status" aria-live="polite">
        {storageError
          ? "Your note is kept in memory. Browser storage is unavailable."
          : `${note.length} characters saved in localStorage.`}
      </p>
    </div>
  );
}

export default NoteSaver;
