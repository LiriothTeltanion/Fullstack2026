// A random index that is never the same as the current one.
export function randomIndex(length, current) {
  if (length < 2) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

// A random color that is dark enough for white text on top of it.
export function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 55%, 38%)`;
}
