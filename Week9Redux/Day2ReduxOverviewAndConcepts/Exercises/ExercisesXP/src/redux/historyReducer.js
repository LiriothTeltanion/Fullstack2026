const MAX_ITEMS = 5;

// Every reducer receives every action, so this one can record the last few types.
export default function historyReducer(state = [], action) {
  if (action.type.startsWith("@@")) {
    return state; // skip the internal actions Redux sends when the store starts
  }
  return [action.type, ...state].slice(0, MAX_ITEMS);
}
