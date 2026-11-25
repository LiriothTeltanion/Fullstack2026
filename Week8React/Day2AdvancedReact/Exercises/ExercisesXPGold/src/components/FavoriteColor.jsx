import { Component } from "react";

class FavoriteColor extends Component {
  constructor(props) {
    super(props);
    this.state = { favoriteColor: "red", allowUpdate: true };
  }

  componentDidMount() {
    // One second after the first render, change the color on its own.
    this.timer = setTimeout(() => {
      this.setState({ favoriteColor: "yellow" });
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // When the checkbox is off, only the checkbox itself may re-render.
    return nextState.allowUpdate || this.state.allowUpdate !== nextState.allowUpdate;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return prevState.favoriteColor;
  }

  componentDidUpdate(prevProps, prevState, previousColor) {
    if (previousColor !== this.state.favoriteColor) {
      const line = `componentDidUpdate: ${previousColor} -> ${this.state.favoriteColor}`;
      console.log(line);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  changeColor = () => {
    this.setState({ favoriteColor: "blue" });
  };

  render() {
    const { favoriteColor, allowUpdate } = this.state;
    return (
      <div>
        <h3 style={{ color: favoriteColor === "yellow" ? "#b08900" : favoriteColor }}>
          My Favorite Color is {favoriteColor}
        </h3>
        <button onClick={this.changeColor}>Change color</button>{" "}
        <label>
          <input
            type="checkbox"
            checked={allowUpdate}
            onChange={() => this.setState({ allowUpdate: !allowUpdate })}
          />{" "}
          Allow updates (shouldComponentUpdate)
        </label>
      </div>
    );
  }
}

export default FavoriteColor;
