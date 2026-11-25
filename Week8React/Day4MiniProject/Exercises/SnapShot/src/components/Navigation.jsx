import { NavLink } from "react-router-dom";

const categories = ["mountain", "beach", "bird", "food"];

function Navigation() {
  return (
    <nav className="categories">
      {categories.map(category => (
        <NavLink key={category} to={`/${category}`}>
          {category}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navigation;
