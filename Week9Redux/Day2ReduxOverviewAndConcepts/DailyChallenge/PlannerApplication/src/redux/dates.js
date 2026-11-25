// "YYYY-MM-DD" in local time (toISOString would use UTC and can show yesterday).
export function toDayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}
