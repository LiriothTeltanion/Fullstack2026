export interface Item {
  id: number;
  name: string;
  quantity: number;
  bought: boolean;
}

// Start above the row count and skip any IDs that survived from an older save.
function nextFreeId(used: Set<number>): number {
  let id = used.size + 1;
  while (used.has(id)) id++;
  return id;
}

function isItem(value: unknown): value is Item {
  if (typeof value !== "object" || value === null) return false;
  return (
    "id" in value &&
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    "name" in value &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isSafeInteger(value.quantity) &&
    value.quantity > 0 &&
    "bought" in value &&
    typeof value.bought === "boolean"
  );
}

export function restoreItems(value: unknown): Item[] {
  if (!Array.isArray(value)) return [];
  const rows = value.filter(isItem);
  const reserved = new Set(rows.map(item => item.id));
  const seen = new Set<number>();
  return rows.map(item => {
    if (seen.has(item.id)) {
      const id = nextFreeId(reserved);
      reserved.add(id);
      return { ...item, id };
    }
    seen.add(item.id);
    return item;
  });
}

// Exercise 1: a discriminated union. `type` decides which other fields exist.
export type Action =
  | { type: "added"; name: string; quantity: number }
  | { type: "toggled"; id: number }
  | { type: "removed"; id: number }
  | { type: "clearedBought" };

export function shoppingReducer(items: Item[], action: Action): Item[] {
  switch (action.type) {
    case "added":
      return [
        ...items,
        {
          id: nextFreeId(new Set(items.map(item => item.id))),
          name: action.name,
          quantity: action.quantity,
          bought: false,
        },
      ];
    case "toggled":
      return items.map(item => (item.id === action.id ? { ...item, bought: !item.bought } : item));
    case "removed":
      return items.filter(item => item.id !== action.id);
    case "clearedBought":
      return items.filter(item => !item.bought);
    default: {
      // If I add an action type and forget a case, this line stops compiling.
      const unhandled: never = action;
      return unhandled;
    }
  }
}
