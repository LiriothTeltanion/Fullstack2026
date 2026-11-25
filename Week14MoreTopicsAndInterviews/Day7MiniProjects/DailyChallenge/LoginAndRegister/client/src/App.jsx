import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AuthForm from "./AuthForm.jsx";
import Dashboard from "./Dashboard.jsx";

function AccountRoutes() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const signOut = () => {
    setUser(null);
    navigate("/signin", { replace: true });
  };
  return (
    <main>
      <Routes>
        <Route
          path="/signin"
          element={<AuthForm key="signin" mode="signin" onAuthenticated={setUser} />}
        />
        <Route
          path="/register"
          element={<AuthForm key="register" mode="register" onAuthenticated={setUser} />}
        />
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} onSignOut={signOut} /> : <Navigate to="/signin" replace />
          }
        />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AccountRoutes />
    </BrowserRouter>
  );
}
