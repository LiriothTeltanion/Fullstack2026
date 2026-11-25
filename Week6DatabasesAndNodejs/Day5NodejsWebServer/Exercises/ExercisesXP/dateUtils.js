// Exercise 5 (module): date helpers used by ex5-date-server.js

export function formatNow(now = new Date()) {
  return now.toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" });
}

// Whole days from `from` until the next time `month`/`day` comes around
export function daysUntil(month, day, from = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  let target = new Date(today.getFullYear(), month - 1, day);
  if (target < today) target = new Date(today.getFullYear() + 1, month - 1, day);
  return Math.round((target - today) / (24 * 60 * 60 * 1000));
}
