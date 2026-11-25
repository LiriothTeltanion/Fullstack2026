import { useDispatch, useSelector } from "react-redux";
import { ageDownAsync, ageUpAsync, selectAge, selectLoading } from "./ageSlice.js";

function AgeDisplay() {
  const age = useSelector(selectAge);
  const loading = useSelector(selectLoading);
  return (
    <>
      <p>Your age:</p>
      <div className="row">
        <span className="big">{age}</span>
        {loading && <span className="spinner" role="status" aria-label="Updating" />}
      </div>
    </>
  );
}

function AgeControls() {
  const age = useSelector(selectAge);
  const loading = useSelector(selectLoading);
  const dispatch = useDispatch();
  return (
    <form className="row" aria-label="Age controls" onSubmit={event => event.preventDefault()}>
      <button
        type="button"
        onClick={() => dispatch(ageDownAsync())}
        disabled={loading || age === 0}
      >
        Age down
      </button>
      <button type="button" onClick={() => dispatch(ageUpAsync())} disabled={loading}>
        Age up
      </button>
    </form>
  );
}

export default function AgeTracker() {
  return (
    <section className="card">
      <AgeDisplay />
      <AgeControls />
    </section>
  );
}
