import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PracticeApp from "./PracticeApp.jsx";
import "./index.css";
import "./practice.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PracticeApp />
  </StrictMode>
);
