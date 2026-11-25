// Returns a random index that is different from the current one.
export function randomOtherIndex(length, current) {
  if (length < 2) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}
