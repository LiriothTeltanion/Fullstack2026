// "Ducks" style: the action types, action creators and reducer for the cart live together.
const ADD_ITEM = "cart/addItem";
const REMOVE_ITEM = "cart/removeItem";
const SET_QUANTITY = "cart/setQuantity";
const CLEAR = "cart/clear";

export const addItem = product => ({ type: ADD_ITEM, payload: product });
export const removeItem = id => ({ type: REMOVE_ITEM, payload: id });
export const setQuantity = (id, quantity) => ({
  type: SET_QUANTITY,
  payload: { id, quantity },
});
export const clearCart = () => ({ type: CLEAR });

// State shape: [{ id, name, price, quantity }]
export default function cartReducer(state = [], action) {
  switch (action.type) {
    case ADD_ITEM: {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case REMOVE_ITEM:
      return state.filter(item => item.id !== action.payload);
    case SET_QUANTITY: {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return state.filter(item => item.id !== id);
      }
      return state.map(item => (item.id === id ? { ...item, quantity } : item));
    }
    case CLEAR:
      return [];
    default:
      return state;
  }
}
