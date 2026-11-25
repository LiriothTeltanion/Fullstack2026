import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { COLUMNS, cardDeleted, cardMoved, cardRenamed, selectColumnCards } from "./boardSlice.js";

export default function Column({ column, index }) {
  // selectColumnCards builds a new array every time; shallowEqual compares the items instead.
  const cards = useSelector(state => selectColumnCards(state, column.id), shallowEqual);
  const dispatch = useDispatch();

  const rename = card => {
    const title = window.prompt("Rename card", card.title);
    if (title && title.trim()) dispatch(cardRenamed({ id: card.id, title: title.trim() }));
  };

  return (
    <section className="card">
      <h2>
        {column.title} <span className="muted">({cards.length})</span>
      </h2>
      {cards.map(card => (
        <div key={card.id} className="task">
          <p style={{ margin: "0 0 6px" }}>{card.title}</p>
          <div className="row">
            <button
              className="secondary"
              disabled={index === 0}
              onClick={() => dispatch(cardMoved({ id: card.id, direction: -1 }))}
              aria-label={`Move "${card.title}" left`}
            >
              ←
            </button>
            <button
              className="secondary"
              disabled={index === COLUMNS.length - 1}
              onClick={() => dispatch(cardMoved({ id: card.id, direction: 1 }))}
              aria-label={`Move "${card.title}" right`}
            >
              →
            </button>
            <button className="secondary" onClick={() => rename(card)}>
              Rename
            </button>
            <button className="danger" onClick={() => dispatch(cardDeleted(card.id))}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
