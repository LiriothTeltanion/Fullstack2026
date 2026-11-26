import { Component } from "react";
import { getClockFields } from "../clock.js";

/** A class-component lifecycle example; switching views unmounts this clock. */
export default class CompassClock extends Component {
  constructor(props) {
    super(props);
    this.state = { now: new Date() };
    this.timerId = null;
  }

  componentDidMount() {
    // Read wall time on every tick. Adding one second to old state would drift
    // when a browser tab is throttled or the computer resumes from sleep.
    this.timerId = window.setInterval(() => this.setState({ now: new Date() }), 1000);
  }

  componentWillUnmount() {
    // Also makes StrictMode's mount/unmount/remount cycle safe in development.
    window.clearInterval(this.timerId);
    this.timerId = null;
  }

  render() {
    const { now } = this.state;
    const clock = getClockFields(now);
    const fields = ["weekday", "year", "month", "day", "hours", "minutes", "seconds"];
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <main className="page compass-page">
        <header className="clock-heading">
          <h1>Compass clock</h1>
          <p>Follow the moment, one second at a time.</p>
        </header>
        <div className="clock-grid">
          <section className="clock-face" aria-label="Local time">
            <svg viewBox="0 0 320 320" role="img" aria-label={`Compass dial showing ${clock.time}`}>
              <circle className="dial-rim" cx="160" cy="160" r="151" />
              <circle className="dial-inner" cx="160" cy="160" r="124" />
              {Array.from({ length: 60 }, (_, index) => (
                <line
                  key={index}
                  className={index % 5 === 0 ? "major-tick" : "minor-tick"}
                  x1="160"
                  y1="37"
                  x2="160"
                  y2={index % 5 === 0 ? "51" : "43"}
                  transform={`rotate(${index * 6} 160 160)`}
                />
              ))}
              <g className="cardinal-labels" textAnchor="middle" dominantBaseline="middle">
                <text x="160" y="23">
                  N
                </text>
                <text x="297" y="160">
                  E
                </text>
                <text x="160" y="299">
                  S
                </text>
                <text x="23" y="160">
                  W
                </text>
              </g>
              <path
                className="compass-rose"
                d="M160 65 L173 147 L255 160 L173 173 L160 255 L147 173 L65 160 L147 147 Z"
              />
              <line
                data-hand="hour"
                className="hour-hand"
                x1="160"
                y1="170"
                x2="160"
                y2="98"
                transform={`rotate(${clock.hourAngle} 160 160)`}
              />
              <line
                data-hand="minute"
                className="minute-hand"
                x1="160"
                y1="177"
                x2="160"
                y2="65"
                transform={`rotate(${clock.minuteAngle} 160 160)`}
              />
              <g data-hand="second" transform={`rotate(${clock.secondAngle} 160 160)`}>
                <line className="second-hand" x1="160" y1="185" x2="160" y2="55" />
                <path className="second-tip" d="M160 48 L155 60 L165 60 Z" />
              </g>
              <circle className="dial-pin" cx="160" cy="160" r="6" />
            </svg>
            <time className="clock-time" data-testid="clock-time" dateTime={now.toISOString()}>
              {clock.time}
            </time>
            <p className="clock-date" data-testid="clock-date">
              {now.toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="clock-zone">Local time · {zone}</p>
          </section>
          <section className="clock-details" aria-labelledby="clock-fields-title">
            <h2 id="clock-fields-title">Date &amp; time</h2>
            <p>One instant, seven fields. The dial uses the same time as the display.</p>
            <dl className="clock-fields">
              {fields.map(field => (
                <div key={field}>
                  <dt>{field}</dt>
                  <dd data-field={field}>{clock[field]}</dd>
                </div>
              ))}
            </dl>
            <p className="clock-note">
              North is 0° (12 o’clock), east 90°, south 180° and west 270°. The short white hand
              shows hours, blue shows minutes and the gold needle shows seconds.
            </p>
          </section>
        </div>
      </main>
    );
  }
}
