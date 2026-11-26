import { createRoot } from "react-dom/client";
import { useLocalStorage } from "../../src/hooks/useLocalStorage.js";

// The note validator is opt-in: other consumers still accept any JSON value.
function GenericProbe() {
  const [value, setValue, storageError] = useLocalStorage("generic-probe", { count: 0 });
  return (
    <main>
      <output>{JSON.stringify(value)}</output>
      <button onClick={() => setValue(previous => ({ count: (previous?.count ?? 0) + 1 }))}>
        Update generic value
      </button>
      <p role="status">{storageError ? "Write failed" : "Write succeeded"}</p>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<GenericProbe />);
