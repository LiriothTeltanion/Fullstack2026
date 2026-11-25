import { createRoot } from "react-dom/client";
import { BuggyCounter } from "./components/LifecycleExercises.jsx";
import "./index.css";

createRoot(document.getElementById("unbounded-root")).render(<BuggyCounter label="Unbounded" />);
