import { useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";
function initialTheme(): Theme {
  try {
    const saved = localStorage.getItem("storytelling-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* Storage restrictions must not prevent reading or switching themes. */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("storytelling-theme", theme);
    } catch {
      /* Theme still works for this visit. */
    }
  }, [theme]);
  return (
    <button
      type="button"
      className="secondary theme-toggle"
      aria-pressed={theme === "dark"}
      aria-label="Dark theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? "Dark theme" : "Light theme"}
      <span aria-hidden="true"> · Switch</span>
    </button>
  );
}
