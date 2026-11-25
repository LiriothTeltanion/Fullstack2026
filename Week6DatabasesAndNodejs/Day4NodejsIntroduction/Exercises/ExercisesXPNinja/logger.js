// Exercise 3 (module): a tiny logger with levels
// Messages below the chosen level are skipped.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

export function createLogger(name, minLevel = "info") {
  const lines = []; // kept so the caller can count or save them later

  function log(level, message) {
    if (LEVELS[level] < LEVELS[minLevel]) return;
    const time = new Date().toISOString().slice(11, 19);
    const line = `[${time}] ${level.toUpperCase().padEnd(5)} ${name}: ${message}`;
    lines.push(line);
    (level === "error" ? console.error : console.log)(line);
  }

  return {
    debug: message => log("debug", message),
    info: message => log("info", message),
    warn: message => log("warn", message),
    error: message => log("error", message),
    history: () => [...lines],
  };
}
