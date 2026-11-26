// The form and validator share the same names, labels and inclusive ranges.
export const coordinateFields = [
  { name: "latitude", label: "Latitude", min: -90, max: 90 },
  { name: "longitude", label: "Longitude", min: -180, max: 180 },
];

const decimalNumber = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i;

export function parseCoordinates(latitude, longitude) {
  const input = { latitude, longitude };
  const parsed = {};
  for (const { name, label, min, max } of coordinateFields) {
    const value = input[name];
    if (typeof value === "string" && !value.trim()) {
      return { field: name, error: `Enter ${label.toLowerCase()}.` };
    }
    // Do not let Number(null), booleans or arrays become plausible locations.
    const supported = typeof value === "number" || typeof value === "string";
    const numericText = typeof value !== "string" || decimalNumber.test(value.trim());
    const number = supported && numericText ? Number(value) : NaN;
    if (!Number.isFinite(number) || number < min || number > max) {
      return { field: name, error: `${label} must be a number from ${min} to ${max}.` };
    }
    parsed[name] = number;
  }
  return { lat: parsed.latitude, lng: parsed.longitude };
}
