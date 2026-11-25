import SearchForm from "./SearchForm.jsx";
import Navigation from "./Navigation.jsx";

function Header() {
  return (
    <header className="header">
      <h1>SnapShot</h1>
      <SearchForm />
      <Navigation />
    </header>
  );
}

export default Header;
