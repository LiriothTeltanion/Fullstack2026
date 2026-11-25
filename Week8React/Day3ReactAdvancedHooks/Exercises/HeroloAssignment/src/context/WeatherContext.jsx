import { createContext, useContext, useEffect, useReducer } from "react";

const WeatherContext = createContext(null);
const STORAGE_KEY = "herolo-weather";

const defaults = { favorites: [], unit: "C", dark: false };

function load() {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return defaults;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "toggleFavorite": {
      const exists = state.favorites.some(city => city.id === action.city.id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter(city => city.id !== action.city.id)
          : [...state.favorites, action.city],
      };
    }
    case "toggleUnit":
      return { ...state, unit: state.unit === "C" ? "F" : "C" };
    case "toggleDark":
      return { ...state, dark: !state.dark };
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  // The third argument runs load() once for the first state.
  const [state, dispatch] = useReducer(reducer, null, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.body.classList.toggle("dark", state.dark);
  }, [state]);

  return (
    <WeatherContext.Provider value={{ ...state, dispatch }}>{children}</WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}
