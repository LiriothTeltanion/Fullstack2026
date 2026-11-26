import { Component } from "react";

class Child extends Component {
  componentWillUnmount() {
    console.log("Child componentWillUnmount: cleanup");
    const { deleteRequested } = this.props;
    if (deleteRequested?.current) {
      // Consume the explicit Delete intent before announcing the actual unmount.
      deleteRequested.current = false;
      alert("The component named Child is about to be unmounted.");
    }
  }

  render() {
    return <h3>Hello World!</h3>;
  }
}

export default Child;
