import { NavLink } from "react-router-dom";
import { useWeather } from "../context/WeatherContext.jsx";

function Header() {
  const { unit, dark, dispatch } = useWeather();

  return (
    <header className="header">
      <strong>Herolo Weather</strong>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </nav>
      <div className="toggles">
        <button onClick={() => dispatch({ type: "toggleUnit" })}>
          °{unit === "C" ? "F" : "C"}
        </button>
        <button onClick={() => dispatch({ type: "toggleDark" })}>{dark ? "Light" : "Dark"}</button>
      </div>
    </header>
  );
}

export default Header;
