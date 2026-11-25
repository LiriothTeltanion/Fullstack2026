import { useEffect, useState } from "react";

// Exercise 3: a generic hook. T is inferred from the initial value.
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initialValue : (JSON.parse(saved) as T);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage is optional: the value still works for this visit
    }
  }, [key, value]);

  return [value, setValue] as const;
}
