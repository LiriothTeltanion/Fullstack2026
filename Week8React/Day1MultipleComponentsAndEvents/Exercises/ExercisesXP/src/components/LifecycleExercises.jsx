import { Component } from "react";

export class BuggyCounter extends Component {
  state = { count: 0 };
  increment = () => this.setState(state => ({ count: state.count + 1 }));

  render() {
    if (this.state.count === 5) throw new Error("The counter reached five.");
    return (
      <button onClick={this.increment}>
        {this.props.label || "Counter"}: {this.state.count}
      </button>
    );
  }
}

export class ErrorBoundary extends Component {
  state = { hasError: false, message: "", stack: "" };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error, info) {
    this.setState({ message: error.message, stack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          <p>Something went wrong: {this.state.message}</p>
          <details>
            <summary>Component details</summary>
            <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
              {this.state.stack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export class FavoriteColor extends Component {
  state = { favoriteColor: "red", updates: [] };

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ favoriteColor: "yellow" }), 2000);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate(previousProps, previousState) {
    // Logging the color change in state triggers another update. Checking the
    // previous color keeps that extra render from starting a loop.
    if (previousState.favoriteColor !== this.state.favoriteColor) {
      this.setState(state => ({ updates: [...state.updates, "after update"] }));
      console.log("after update");
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div>
        <h3>My favorite color is {this.state.favoriteColor}</h3>
        <button onClick={() => this.setState({ favoriteColor: "blue" })}>Change to blue</button>
        <ul aria-label="Update log">
          {this.state.updates.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export class Child extends Component {
  componentWillUnmount() {
    window.alert("The Child component is about to be unmounted.");
  }

  render() {
    return (
      <header>
        <h3>Hello World!</h3>
      </header>
    );
  }
}

export class UnmountDemo extends Component {
  state = { show: true };
  render() {
    return (
      <div>
        {this.state.show && <Child />}
        <button disabled={!this.state.show} onClick={() => this.setState({ show: false })}>
          Delete
        </button>
      </div>
    );
  }
}

export default function LifecycleExercises() {
  return (
    <>
      <section className="card">
        <h2>Exercise 1 · Error boundaries</h2>
        <p>Each counter throws during render when it reaches five.</p>
        <h3>Two counters inside one boundary</h3>
        <ErrorBoundary>
          <BuggyCounter label="Shared A" />
          <BuggyCounter label="Shared B" />
        </ErrorBoundary>
        <h3>One boundary per counter</h3>
        <ErrorBoundary>
          <BuggyCounter label="Independent A" />
        </ErrorBoundary>
        <ErrorBoundary>
          <BuggyCounter label="Independent B" />
        </ErrorBoundary>
        <h3>Counter without a boundary</h3>
        <p>
          <a href="./unbounded.html" target="_blank" rel="noreferrer">
            Open the isolated counter page
          </a>
          . Its root clears after the error, while this page keeps working.
        </p>
      </section>
      <section className="card">
        <h2>Exercise 2 · Favorite color lifecycle</h2>
        <FavoriteColor />
      </section>
      <section className="card">
        <h2>Exercise 3 · Unmounting a child</h2>
        <UnmountDemo />
      </section>
    </>
  );
}
