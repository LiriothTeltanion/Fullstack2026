import type { ReactNode } from "react";

// A generic list: it doesn't know what T is, the parent decides how each item looks.
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string | number;
  emptyText?: string;
}

export default function List<T>({
  items,
  renderItem,
  getKey,
  emptyText = "Nothing to show.",
}: ListProps<T>) {
  if (items.length === 0) return <p className="muted">{emptyText}</p>;
  return (
    <ul className="plain">
      {items.map(item => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}
