// The row only shows data; the click goes back up through the onVote prop.
export default function LanguageRow({ language, percent, leading, tiedForLead, onVote }) {
  return (
    <li className={leading ? "row leading" : "row"}>
      <span className="votes">
        {language.votes}
        <span className="visually-hidden">{language.votes === 1 ? " vote" : " votes"}</span>
      </span>
      <span className="name">
        {language.name}
        {leading && (
          <small className="leader-label">{tiedForLead ? "Tied for lead" : "Leading"}</small>
        )}
      </span>
      <span className="share">
        <span className="bar" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </span>
        <span className="percentage">
          {percent}%<span className="visually-hidden"> of votes</span>
        </span>
      </span>
      <button
        type="button"
        aria-label={`Click Here to vote for ${language.name}`}
        onClick={() => onVote(language.name)}
      >
        Click Here
      </button>
    </li>
  );
}
