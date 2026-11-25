import { Component } from "react";

// Error boundaries still have to be class components.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  reset = () => {
    this.setState({ error: null, errorInfo: null });
  };

  render() {
    const { error, errorInfo } = this.state;

    if (error) {
      return (
        <div className="crash">
          <strong>{this.props.fallback || "Something went wrong."}</strong>
          <details>
            <summary>Details</summary>
            <pre>
              {error.toString()}
              {errorInfo?.componentStack}
            </pre>
          </details>
          <button onClick={this.reset}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
