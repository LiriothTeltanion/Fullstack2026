import FilterBar from "./features/filters/FilterBar.jsx";
import MovieForm from "./features/movies/MovieForm.jsx";
import MovieList from "./features/movies/MovieList.jsx";

export default function App() {
  return (
    <main>
      <h1>Movie collection</h1>
      <MovieForm />
      <FilterBar />
      <MovieList />
    </main>
  );
}
