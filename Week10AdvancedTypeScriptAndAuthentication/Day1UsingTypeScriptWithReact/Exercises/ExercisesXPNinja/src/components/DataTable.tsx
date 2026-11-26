import { useState, type ReactNode } from "react";

// Exercise 1: a column is tied to the row type, so `key` must be a real field of T.
export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string | number;
}

type SortState<T> = { key: keyof T; direction: "asc" | "desc" } | null;

// Exercise 2: sorting by any column, with the sort key typed as keyof T.
export default function DataTable<T>({ rows, columns, getRowId }: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState<T>>(null);

  const sorted = sort
    ? [...rows].sort((a, b) => {
        const left = a[sort.key];
        const right = b[sort.key];
        const result = left < right ? -1 : left > right ? 1 : 0;
        return sort.direction === "asc" ? result : -result;
      })
    : rows;

  const toggleSort = (key: keyof T) => {
    setSort(current =>
      current?.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const arrow = (key: keyof T) =>
    sort?.key === key ? (sort.direction === "asc" ? " ▲" : " ▼") : "";

  return (
    <div className="table-scroll" role="region" aria-label="Sortable data table" tabIndex={0}>
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={String(column.key)}
                scope="col"
                aria-sort={
                  sort?.key === column.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <button onClick={() => toggleSort(column.key)}>
                  {column.header}
                  {arrow(column.key)}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(row => (
            <tr key={getRowId(row)}>
              {columns.map(column => (
                <td key={String(column.key)}>
                  {column.render ? column.render(row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
