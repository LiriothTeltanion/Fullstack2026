// Read the actual clock on each tick: delayed callbacks must not invent elapsed time.
export function startClock(
  onTick,
  { now = Date.now, schedule = setInterval, cancel = clearInterval } = {}
) {
  let running = true;
  const timer = schedule(() => {
    if (running) onTick(new Date(now()));
  }, 1000);

  return () => {
    if (!running) return;
    running = false;
    cancel(timer);
  };
}
