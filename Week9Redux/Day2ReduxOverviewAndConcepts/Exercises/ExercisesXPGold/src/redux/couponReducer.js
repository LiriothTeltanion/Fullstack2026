const APPLY = "coupon/apply";
const REMOVE = "coupon/remove";

// The only codes the shop knows, with their discount in percent.
const CODES = { SAVE10: 10, STUDENT15: 15 };

export const applyCoupon = code => ({ type: APPLY, payload: code.trim().toUpperCase() });
export const removeCoupon = () => ({ type: REMOVE });

const initialState = { code: null, percent: 0, error: null };

export default function couponReducer(state = initialState, action) {
  switch (action.type) {
    case APPLY: {
      const percent = CODES[action.payload];
      if (!percent) {
        return { ...state, error: `"${action.payload}" is not a valid code` };
      }
      return { code: action.payload, percent, error: null };
    }
    case REMOVE:
      return initialState;
    default:
      return state;
  }
}
