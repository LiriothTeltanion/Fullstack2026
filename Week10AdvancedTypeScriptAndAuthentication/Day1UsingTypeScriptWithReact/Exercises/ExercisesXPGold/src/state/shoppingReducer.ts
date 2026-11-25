export interface Item {
  id: number;
  name: string;
  quantity: number;
  bought: boolean;
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
        { id: Date.now(), name: action.name, quantity: action.quantity, bought: false },
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
