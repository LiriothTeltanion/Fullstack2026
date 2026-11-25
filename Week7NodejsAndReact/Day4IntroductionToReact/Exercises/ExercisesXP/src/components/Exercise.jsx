import { Component } from "react";
import "./Exercise.css";

// Exercise 3: inline styles are objects with camelCase keys.
const styleHeader = {
  color: "white",
  backgroundColor: "DodgerBlue",
  padding: "10px",
  fontFamily: "Arial",
};

export default class Exercise extends Component {
  render() {
    return (
      <div>
        <h1 style={styleHeader}>This is a Header</h1>
        <p className="para">This is a Paragraph (styled from Exercise.css with className)</p>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          This is a Link
        </a>

        <form onSubmit={event => event.preventDefault()}>
          <h3>This is a Form:</h3>
          <label htmlFor="name">Enter your name: </label>
          <input id="name" type="text" />
          <button type="submit">Submit</button>
        </form>

        <h3>Here is an Image:</h3>
        <img src="/atom.svg" alt="React atom logo" width="120" height="120" />

        <h3>This is a List:</h3>
        <ul>
          <li>Coffee</li>
          <li>Tea</li>
          <li>Milk</li>
        </ul>
      </div>
    );
  }
}
