import { Component } from "react";

// Error boundaries still have to be class components.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error boundary caught a render error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  reset = () => {
    // The parent must also remove the cause of the failing paragraph before retrying.
    this.props.onReset?.();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      return (
        <div className="crash" role="alert">
          <strong>{this.props.fallback || "Something went wrong."}</strong>
          <details>
            <summary>Details</summary>
            <pre>
              {error.toString()}
              {errorInfo?.componentStack}
            </pre>
          </details>
          <button onClick={this.reset}>{this.props.resetLabel || "Try again"}</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
