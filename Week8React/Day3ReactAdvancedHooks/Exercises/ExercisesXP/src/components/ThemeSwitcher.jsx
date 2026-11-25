import { useTheme } from "../context/ThemeContext.jsx";

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <p>The current theme is {theme}.</p>
      <button onClick={toggleTheme}>Switch to {theme === "light" ? "dark" : "light"}</button>
    </div>
  );
}

export default ThemeSwitcher;
