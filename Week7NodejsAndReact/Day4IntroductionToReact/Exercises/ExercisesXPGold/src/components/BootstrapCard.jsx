// A real Bootstrap card: existing data flows through props into its body and link.
export default function BootstrapCard({
  name = "Guest profile",
  description = "No description provided.",
  color = "#67e8f9",
  buttonLabel = "Read more",
  buttonUrl,
}) {
  const initials = name
    .trim()
    .split(/\s+/u)
    .map(word => word[0])
    .join("")
    .slice(0, 2);
  return (
    <article className="card bootstrap-card h-100">
      <div className="card-header d-flex align-items-center gap-3">
        <span className="profile-initials" style={{ backgroundColor: color }} aria-hidden="true">
          {initials}
        </span>
        <span className="small text-body-secondary">A profile rendered from props</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{name}</h3>
        <p className="card-text flex-grow-1">{description}</p>
        {buttonUrl ? (
          <a
            className="btn btn-primary align-self-start"
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {buttonLabel}
            <span className="visually-hidden"> about {name} (opens a new tab)</span>
          </a>
        ) : (
          <p className="small text-body-secondary mb-0">No external link provided.</p>
        )}
      </div>
    </article>
  );
}
