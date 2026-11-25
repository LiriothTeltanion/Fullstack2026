import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers, userRemoved } from "./usersSlice.js";

export default function UserFilter({ selected, onSelect }) {
  const users = useSelector(selectAllUsers);
  const dispatch = useDispatch();

  const removeSelected = () => {
    dispatch(userRemoved(selected));
    onSelect("all");
  };

  return (
    <div className="row">
      <select
        value={selected}
        onChange={event => onSelect(event.target.value)}
        aria-label="Show posts by"
      >
        <option value="all">Everyone</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button className="danger" onClick={removeSelected} disabled={selected === "all"}>
        Remove this user
      </button>
    </div>
  );
}
