import { useSelector } from "react-redux";

export default function ActionHistory() {
  const history = useSelector(state => state.history);

  return (
    <section className="card">
      <h2>Last actions</h2>
      {history.length === 0 ? (
        <p className="muted">Click something above to dispatch an action.</p>
      ) : (
        <ol>
          {history.map((type, index) => (
            <li key={index}>
              <code>{type}</code>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
