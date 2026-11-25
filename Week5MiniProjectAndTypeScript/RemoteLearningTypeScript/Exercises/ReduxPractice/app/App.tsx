import { Provider } from "react-redux";
import { HashRouter, NavLink, Navigate, Route, Routes } from "react-router-dom";
import GoldPage from "../ExercisesXPGold/src/GoldPage";
import Login from "../ExercisesXPNinja/src/Login";
import Profile from "../ExercisesXPNinja/src/Profile";
import PrivateRoute from "../ExercisesXPNinja/src/PrivateRoute";
import { createAppStore, type AppStore } from "./store";
const defaultStore = createAppStore();
export default function App({ store = defaultStore }: { store?: AppStore }) {
  return (
    <Provider store={store}>
      <HashRouter>
        <header>
          <NavLink className="brand" to="/gold">
            Remote practice
          </NavLink>
          <nav aria-label="Practice levels">
            <NavLink to="/gold">Gold · tasks</NavLink>
            <NavLink to="/ninja/login">Ninja · profile</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/gold" element={<GoldPage />} />
            <Route path="/ninja/login" element={<Login />} />
            <Route
              path="/ninja/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/gold" replace />} />
          </Routes>
        </main>
        <footer>Kevin Cusnir · Local practice</footer>
      </HashRouter>
    </Provider>
  );
}
