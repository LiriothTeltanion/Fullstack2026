import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(items, action) {
  switch (action.type) {
    case "add": {
      const existing = items.find(item => item.id === action.product.id);
      if (existing) {
        return items.map(item =>
          item.id === action.product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...items, { ...action.product, qty: 1 }];
    }
    case "decrease":
      return items
        .map(item => (item.id === action.id ? { ...item, qty: item.qty - 1 } : item))
        .filter(item => item.qty > 0);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return <CartContext.Provider value={{ items, total, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
