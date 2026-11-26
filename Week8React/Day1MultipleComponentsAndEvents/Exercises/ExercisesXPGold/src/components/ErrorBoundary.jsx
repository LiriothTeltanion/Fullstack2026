import { Component } from "react";
import Modal from "./Modal.jsx";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <Modal
          title="Set list unavailable"
          dismissLabel="Return to rehearsal"
          onDismiss={this.props.onRecover}
        >
          <p>The preview could not load this set list. Return to the rehearsal set to try again.</p>
        </Modal>
      );
    }
    return this.props.children;
  }
}
