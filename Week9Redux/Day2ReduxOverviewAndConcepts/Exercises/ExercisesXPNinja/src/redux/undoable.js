export const UNDO = "history/undo";
export const REDO = "history/redo";

export const undo = () => ({ type: UNDO });
export const redo = () => ({ type: REDO });

// A higher-order reducer: it takes a reducer and returns a new one with undo/redo.
export default function undoable(reducer) {
  const initialState = {
    past: [],
    present: reducer(undefined, { type: "@@undoable/init" }),
    future: [],
  };

  return function undoableReducer(state = initialState, action) {
    const { past, present, future } = state;

    switch (action.type) {
      case UNDO:
        if (past.length === 0) return state;
        return {
          past: past.slice(0, -1),
          present: past[past.length - 1],
          future: [present, ...future],
        };
      case REDO:
        if (future.length === 0) return state;
        return {
          past: [...past, present],
          present: future[0],
          future: future.slice(1),
        };
      default: {
        const newPresent = reducer(present, action);
        if (newPresent === present) return state; // the action didn't change anything
        return { past: [...past, present], present: newPresent, future: [] };
      }
    }
  };
}
