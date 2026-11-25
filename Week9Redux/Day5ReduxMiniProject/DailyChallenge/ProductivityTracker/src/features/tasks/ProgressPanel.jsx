import { useSelector } from "react-redux";
import { selectProgressByCategory } from "./tasksSlice.js";

export default function ProgressPanel() {
  const rows = useSelector(selectProgressByCategory);

  return (
    <section className="card">
      <h2>Progress by category</h2>
      {rows.map(row => (
        <div key={row.id} style={{ marginBottom: 10 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span>{row.name}</span>
            <span className="muted">
              {row.done}/{row.total} · {row.percent}%
            </span>
          </div>
          <div
            className="bar"
            role="progressbar"
            aria-valuenow={row.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={row.name}
          >
            <span style={{ width: `${row.percent}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
