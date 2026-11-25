import { Component } from "react";

class Child extends Component {
  componentWillUnmount() {
    alert("The component named Header is about to be unmounted.");
  }

  render() {
    return <h3>Hello World!</h3>;
  }
}

export default Child;
