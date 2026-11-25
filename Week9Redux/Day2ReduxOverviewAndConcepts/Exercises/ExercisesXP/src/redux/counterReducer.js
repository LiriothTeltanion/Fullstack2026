import { DECREMENT, INCREMENT, RESET } from "./actionTypes.js";

const initialState = { value: 0 };

// A reducer is a pure function: same state + same action = same new state.
export default function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 };
    case DECREMENT:
      return { ...state, value: state.value - 1 };
    case RESET:
      return initialState;
    default:
      return state;
  }
}
