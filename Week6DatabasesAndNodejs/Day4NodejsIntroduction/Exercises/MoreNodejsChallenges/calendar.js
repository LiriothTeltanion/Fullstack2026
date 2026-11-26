import Holidays from "date-holidays";

function timestamp(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError("A valid reference date is required.");
  }
  return date.getTime();
}

export function timeUntilNewYear(now = new Date()) {
  const start = timestamp(now);
  const nextYear = new Date(start);
  nextYear.setUTCFullYear(now.getUTCFullYear() + 1, 0, 1);
  nextYear.setUTCHours(0, 0, 0, 0);
  if (!Number.isFinite(nextYear.getTime()))
    throw new RangeError("Next January is outside the JavaScript Date range.");
  return nextYear.getTime() - start;
}

export function minutesLived(birthDate, now = new Date()) {
  const end = timestamp(now);
  if (typeof birthDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw new RangeError("Use a birth date in YYYY-MM-DD format.");
  }
  const birth = new Date(birthDate + "T00:00:00.000Z");
  // Date can normalize an impossible day into the following month.
  if (!Number.isFinite(birth.getTime()) || birth.toISOString().slice(0, 10) !== birthDate) {
    throw new RangeError("That birth date does not exist.");
  }
  if (birth.getTime() > end) throw new RangeError("The birth date is in the future.");
  return Math.floor((end - birth.getTime()) / 60_000);
}

export function nextHoliday(now = new Date()) {
  const current = timestamp(now);
  const calendar = new Holidays("IL", { languages: ["en"], types: ["public"] });
  const year = Number(
    new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Jerusalem" }).format(now)
  );
  if (now.getUTCFullYear() < 1969 || year < 1970 || year > 2100) {
    throw new RangeError("The Israeli holiday calendar supports years 1970 through 2100.");
  }
  // The provider supplies the actual start/end instants, including evening starts.
  for (const candidateYear of [year, year + 1]) {
    if (candidateYear > 2100) break;
    const holiday = calendar
      .getHolidays(candidateYear)
      .find(entry => entry.end.getTime() > current);
    if (holiday) {
      return {
        name: holiday.name,
        start: holiday.start,
        remainingMs: Math.max(0, holiday.start.getTime() - current),
        underway: holiday.start.getTime() <= current,
      };
    }
  }
  throw new RangeError("No upcoming public holiday was found in the supported Israeli calendar.");
}
