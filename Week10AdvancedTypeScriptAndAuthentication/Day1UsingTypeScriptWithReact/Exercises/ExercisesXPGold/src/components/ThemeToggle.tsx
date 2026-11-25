import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="secondary" onClick={toggleTheme}>
      Switch to {theme === "dark" ? "light" : "dark"} theme
    </button>
  );
}
