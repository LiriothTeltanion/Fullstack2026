// "YYYY-MM-DD" built from local time.
export function toDayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

// The seven day keys of the week (Sunday first) that contains `dayKey`.
export function weekOf(dayKey) {
  const [year, month, day] = dayKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(date);
    current.setDate(date.getDate() + index);
    return toDayKey(current);
  });
}

export function shiftDays(dayKey, amount) {
  const [year, month, day] = dayKey.split("-").map(Number);
  return toDayKey(new Date(year, month - 1, day + amount));
}
