// The list comes in as a prop and map() turns every string into an <li>.
export default function UserFavoriteAnimals({ favAnimals }) {
  return (
    <ul>
      {favAnimals.map(animal => (
        <li key={animal}>{animal}</li>
      ))}
    </ul>
  );
}
