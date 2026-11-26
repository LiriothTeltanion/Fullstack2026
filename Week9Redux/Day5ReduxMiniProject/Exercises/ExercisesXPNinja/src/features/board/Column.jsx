import { useLayoutEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { COLUMNS, cardDeleted, cardMoved, cardRenamed, selectColumnCards } from "./boardSlice.js";

export default function Column({ column, index, focusRequest }) {
  // selectColumnCards builds a new array every time; shallowEqual compares the items instead.
  const cards = useSelector(state => selectColumnCards(state, column.id), shallowEqual);
  const dispatch = useDispatch();
  const columnElement = useRef(null);

  useLayoutEffect(() => {
    const request = focusRequest.current;
    if (!request || !cards.some(card => String(card.id) === request.cardId)) return;
    focusRequest.current = null;
    // An intervening focus change belongs to the user, even if a move is pending.
    if (document.activeElement !== document.body && document.activeElement !== request.control) {
      return;
    }
    const controls = [...columnElement.current.querySelectorAll("button[data-card-id]")].filter(
      control => control.dataset.cardId === request.cardId && !control.disabled
    );
    const target =
      controls.find(control => Number(control.dataset.moveDirection) === request.direction) ??
      controls[0];
    target?.focus();
  }, [cards, focusRequest]);

  const move = (cardId, direction, event) => {
    focusRequest.current =
      event.detail === 0 && document.activeElement === event.currentTarget
        ? { cardId: String(cardId), direction, control: event.currentTarget }
        : null;
    dispatch(cardMoved({ id: cardId, direction }));
  };

  const rename = card => {
    const title = window.prompt("Rename card", card.title);
    if (title && title.trim()) dispatch(cardRenamed({ id: card.id, title: title.trim() }));
  };

  return (
    <section className="card" ref={columnElement}>
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
              onClick={event => move(card.id, -1, event)}
              data-card-id={card.id}
              data-move-direction={-1}
              aria-label={`Move "${card.title}" left`}
            >
              ←
            </button>
            <button
              className="secondary"
              disabled={index === COLUMNS.length - 1}
              onClick={event => move(card.id, 1, event)}
              data-card-id={card.id}
              data-move-direction={1}
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
