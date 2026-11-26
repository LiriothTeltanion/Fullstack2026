import { Component, createRef } from "react";

export default class Modal extends Component {
  dialog = createRef();

  componentDidMount() {
    this.dialog.current.showModal();
  }

  componentWillUnmount() {
    // Closing the native dialog also returns keyboard focus to its opener.
    this.dialog.current.close();
  }

  render() {
    const { title, children, onDismiss, dismissLabel } = this.props;
    return (
      <dialog
        className="recovery-dialog"
        ref={this.dialog}
        aria-label={title}
        onCancel={event => {
          event.preventDefault();
          onDismiss();
        }}
      >
        <h3>{title}</h3>
        {children}
        <button type="button" onClick={onDismiss}>
          {dismissLabel}
        </button>
      </dialog>
    );
  }
}
