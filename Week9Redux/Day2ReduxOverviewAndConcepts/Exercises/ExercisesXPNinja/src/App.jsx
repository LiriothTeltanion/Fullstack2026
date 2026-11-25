import NoteBoard from "./components/NoteBoard.jsx";

export default function App() {
  return (
    <main>
      <h1>Sticky notes with undo</h1>
      <p className="muted">
        Open the browser console to see the logger middleware print every action.
      </p>
      <NoteBoard />
    </main>
  );
}
