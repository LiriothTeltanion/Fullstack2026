// Exercise 3: an array of objects becomes a row of links.
export default function SocialMedia({ links }) {
  return (
    <nav className="social" aria-label="Links">
      {links.map(({ label, url }) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          {label}
        </a>
      ))}
    </nav>
  );
}
