const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Read every displayed field from one instant, so midnight cannot mix two dates. */
export function getClockFields(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("A valid Date is required.");
  }
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const pad = value => String(value).padStart(2, "0");
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: weekdays[date.getDay()],
    hours,
    minutes,
    seconds,
    time: [hours, minutes, seconds].map(pad).join(":"),
    // Include smaller units in each hand rather than snapping the hour at :00.
    hourAngle: (hours % 12) * 30 + minutes / 2 + seconds / 120,
    minuteAngle: minutes * 6 + seconds / 10,
    secondAngle: seconds * 6,
  };
}
