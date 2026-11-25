import { useEffect, useRef } from "react";

// Returns the value from the previous render.
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
