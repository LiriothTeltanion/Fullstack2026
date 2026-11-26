import { useEffect, useState } from "react";

// Works like useState. A successful storage write survives a page reload.
export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;
      const parsed = JSON.parse(saved);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      return initialValue;
    }
  });

  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch {
      // Storage can be full or blocked; the app still works in memory.
      setStorageError(true);
    }
  }, [key, value]);

  return [value, setValue, storageError];
}
