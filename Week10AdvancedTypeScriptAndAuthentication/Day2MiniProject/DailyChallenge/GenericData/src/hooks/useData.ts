import { useCallback, useEffect, useState } from "react";

// The three states a request can be in. Only "success" has data, only "error" has a message.
export type DataState<T> =
  { status: "loading" } | { status: "error"; message: string } | { status: "success"; data: T };

export function useData<T>(url: string) {
  const [state, setState] = useState<DataState<T>>({ status: "loading" });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error(`Server answered ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then(data => setState({ status: "success", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // the component moved on, ignore it
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      });

    return () => controller.abort();
  }, [url, reloadCount]);

  const reload = useCallback(() => setReloadCount(count => count + 1), []);

  return { state, reload };
}
