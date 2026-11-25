import type { ReactNode } from "react";
import { useData } from "../hooks/useData";

interface DataFetcherProps<T> {
  url: string;
  render: (data: T) => ReactNode;
  title: string;
}

// A generic component: it loads any JSON and hands it, typed, to `render`.
export default function DataFetcher<T>({ url, render, title }: DataFetcherProps<T>) {
  const { state, reload } = useData<T>(url);

  return (
    <section className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2>{title}</h2>
        <button className="secondary" onClick={reload} disabled={state.status === "loading"}>
          Reload
        </button>
      </div>
      {state.status === "loading" && <p className="muted">Loading…</p>}
      {state.status === "error" && <p className="error">Could not load: {state.message}</p>}
      {state.status === "success" && render(state.data)}
    </section>
  );
}
