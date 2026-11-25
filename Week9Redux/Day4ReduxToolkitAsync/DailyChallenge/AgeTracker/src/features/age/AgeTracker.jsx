import { useDispatch, useSelector } from "react-redux";
import { ageDownAsync, ageUpAsync, selectAge, selectLoading } from "./ageSlice.js";

export default function AgeTracker() {
  const age = useSelector(selectAge);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();

  return (
    <section className="card" aria-busy={loading}>
      <p>Your age:</p>
      <div className="row">
        <span className="big">{age}</span>
        {loading && <span className="spinner" role="status" aria-label="Updating" />}
      </div>
      <div className="row">
        <button onClick={() => dispatch(ageDownAsync())} disabled={loading || age === 0}>
          Age down
        </button>
        <button onClick={() => dispatch(ageUpAsync())} disabled={loading}>
          Age up
        </button>
      </div>
    </section>
  );
}
