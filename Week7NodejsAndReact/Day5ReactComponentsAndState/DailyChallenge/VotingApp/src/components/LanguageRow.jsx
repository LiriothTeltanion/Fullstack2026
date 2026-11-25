// The row only shows data; the click goes back up through the onVote prop.
export default function LanguageRow({ language, percent, leading, onVote }) {
  return (
    <li className={leading ? "row leading" : "row"}>
      <span className="votes">{language.votes}</span>
      <span className="name">{language.name}</span>
      <span className="bar" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </span>
      <button onClick={() => onVote(language.name)}>Click Here</button>
    </li>
  );
}
