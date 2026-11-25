import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import "./index.css";

// The outer boundary catches anything the app itself does not catch
// (simulation 3 has no boundary of its own).
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary fallback="The whole app crashed.">
      <App />
    </ErrorBoundary>
  </StrictMode>
);
