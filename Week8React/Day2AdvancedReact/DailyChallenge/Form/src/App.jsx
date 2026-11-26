import CountryAutocomplete from "./components/CountryAutocomplete.jsx";
import SignUpForm from "./components/SignUpForm.jsx";

function App() {
  return (
    <main className="page narrow">
      <h1>Find a country. Keep exploring.</h1>
      <p className="muted">
        An autocomplete exercise, with the original sign-up practice preserved below.
      </p>
      <CountryAutocomplete />
      <h2>Create an account</h2>
      <SignUpForm />
    </main>
  );
}

export default App;
