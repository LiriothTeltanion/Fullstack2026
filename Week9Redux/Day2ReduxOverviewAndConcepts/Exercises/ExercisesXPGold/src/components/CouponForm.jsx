import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon, removeCoupon } from "../redux/couponReducer.js";

export default function CouponForm() {
  const coupon = useSelector(state => state.coupon);
  const dispatch = useDispatch();
  const [code, setCode] = useState("");

  const handleSubmit = event => {
    event.preventDefault();
    if (code.trim()) dispatch(applyCoupon(code));
    setCode("");
  };

  return (
    <section className="card">
      <h2>Coupon</h2>
      {coupon.code ? (
        <p className="row">
          <span>
            {coupon.code} applied (-{coupon.percent}%)
          </span>
          <button className="secondary" onClick={() => dispatch(removeCoupon())}>
            Remove
          </button>
        </p>
      ) : (
        <form className="row" onSubmit={handleSubmit}>
          <input
            value={code}
            onChange={event => setCode(event.target.value)}
            placeholder="Try SAVE10"
            aria-label="Coupon code"
          />
          <button type="submit">Apply</button>
        </form>
      )}
      {coupon.error && <p className="error">{coupon.error}</p>}
    </section>
  );
}
