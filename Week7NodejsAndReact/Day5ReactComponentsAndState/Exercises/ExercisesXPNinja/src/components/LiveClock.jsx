import { Component } from "react";
import { startClock } from "../clockTicker.js";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default class LiveClock extends Component {
  state = { now: new Date() };

  componentDidMount() {
    this.stopClock = startClock(now => this.setState({ now }));
  }

  componentWillUnmount() {
    this.stopClock?.();
  }

  render() {
    const { now } = this.state;
    return (
      <section className="clock-card" aria-labelledby="clock-title">
        <h2 id="clock-title">Your local time</h2>
        {/* A second-by-second live announcement would interrupt screen-reader users. */}
        <time dateTime={now.toISOString()} aria-live="off" className="clock-time">
          {timeFormat.format(now)}
        </time>
        <p className="clock-date">{dateFormat.format(now)}</p>
        <p className="clock-zone">{timeFormat.resolvedOptions().timeZone}</p>
        <p className="clock-note">
          The clock follows your device. Open the quote machine to pause this view, then return for
          the current time.
        </p>
      </section>
    );
  }
}
