import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Caught by ErrorBoundary:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return <h3 className="error">An error has occurred.</h3>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
