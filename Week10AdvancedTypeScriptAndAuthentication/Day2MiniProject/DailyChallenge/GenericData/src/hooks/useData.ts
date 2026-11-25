import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadData } from "../features/dataSlice";
import type { AppDispatch, RootState } from "../store";

export type DataState<T> =
  { status: "loading" } | { status: "error"; message: string } | { status: "success"; data: T };

/** Redux owns request state; T describes what the component expects from this URL. */
export function useData<T>(url: string) {
  const dispatch = useDispatch<AppDispatch>();
  const entry = useSelector((state: RootState) => state.data.byUrl[url]);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const request = dispatch(loadData(url));
    return () => request.abort();
  }, [dispatch, url, reloadCount]);

  const reload = useCallback(() => setReloadCount(count => count + 1), []);
  let state: DataState<T> = { status: "loading" };
  if (entry?.error) state = { status: "error", message: entry.error };
  else if (entry && !entry.loading && entry.hasData) {
    state = { status: "success", data: entry.data as T };
  }
  return { state, reload };
}
