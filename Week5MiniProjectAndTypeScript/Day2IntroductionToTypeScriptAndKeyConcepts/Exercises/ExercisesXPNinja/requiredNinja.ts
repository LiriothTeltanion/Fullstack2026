// Conditional types describe the result without losing the caller's generic input.
export type MappedType<T> = T extends number ? number : T extends string ? number : never;

export function mapType<T extends number | string>(value: T): MappedType<T> {
  if (typeof value !== "number" && typeof value !== "string") {
    throw new TypeError("Use a number or a string.");
  }
  const mapped = typeof value === "number" ? value * value : value.length;
  if (!Number.isFinite(mapped)) throw new RangeError("The mapped result must be finite.");
  // TypeScript cannot narrow a conditional generic return type inside the branch.
  return mapped as MappedType<T>;
}

export function getProperty<T extends object, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

// K picks the required property; other object properties can have other types.
export type HasNumericProperty<K extends PropertyKey> = { [P in K]: number };

export function multiplyProperty<K extends PropertyKey, T extends HasNumericProperty<K>>(
  object: T,
  key: K,
  factor: number
): number {
  const value = object[key];
  if (typeof value !== "number" || !Number.isFinite(value) || !Number.isFinite(factor)) {
    throw new TypeError("The property and factor must be finite numbers.");
  }
  const result = value * factor;
  if (!Number.isFinite(result)) throw new RangeError("The multiplied result must be finite.");
  return result;
}
