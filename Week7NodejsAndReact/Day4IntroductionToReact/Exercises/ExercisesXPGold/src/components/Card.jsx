// Exercise 1: one reusable card, filled in through props.
function initials(name) {
  return name
    .split(" ")
    .map(word => word[0])
    .join("")
    .slice(0, 2);
}

export default function Card({ name, description, color, buttonLabel, buttonUrl }) {
  return (
    <article className="card">
      <div className="avatar" style={{ backgroundColor: color }} aria-hidden="true">
        {initials(name)}
      </div>
      <h3>{name}</h3>
      <p>{description}</p>
      <a href={buttonUrl} target="_blank" rel="noreferrer">
        {buttonLabel}
      </a>
    </article>
  );
}
