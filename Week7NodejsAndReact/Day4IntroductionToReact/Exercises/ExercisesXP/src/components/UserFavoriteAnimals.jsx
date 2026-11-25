import { Component } from "react";

// The list comes in as a prop and map() turns every string into an <li>.
export default class UserFavoriteAnimals extends Component {
  render() {
    const { favAnimals } = this.props;
    return (
      <ul>
        {favAnimals.map(animal => (
          <li key={animal}>{animal}</li>
        ))}
      </ul>
    );
  }
}
