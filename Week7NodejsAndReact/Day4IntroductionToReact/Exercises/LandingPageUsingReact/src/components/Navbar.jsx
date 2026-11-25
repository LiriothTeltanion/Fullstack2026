const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <a href="#top" className="brand">
        Neon Notes
      </a>
      <nav aria-label="Main">
        {links.map(link => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
