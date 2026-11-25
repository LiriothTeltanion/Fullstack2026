function Panel({ title, isOpen, onToggle, children }) {
  return (
    <div className="panel">
      <button className="panel-title" onClick={onToggle} aria-expanded={isOpen}>
        {isOpen ? "▾" : "▸"} {title}
      </button>
      {isOpen && <p className="panel-body">{children}</p>}
    </div>
  );
}

export default Panel;
