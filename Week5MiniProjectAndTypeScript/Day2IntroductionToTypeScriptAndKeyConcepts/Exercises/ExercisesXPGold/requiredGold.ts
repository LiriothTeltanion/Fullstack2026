// Assignment-aligned functions kept separate from the earlier extra practice.
// Run examples with: node requiredGold.examples.ts

export function processValue(value: string | number): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new RangeError("Use a finite currency amount.");
    // Avoid exponential output for large finite values while keeping two decimals.
    return (
      "$" +
      value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      })
    );
  }
  if (typeof value !== "string") throw new TypeError("Use a number or a string.");
  // Array.from keeps surrogate pairs (such as emoji) intact while reversing.
  return Array.from(value).reverse().join("");
}

export function sumNumbersInArray(values: readonly unknown[]): number {
  // Numeric strings stay strings. Ignore non-finite values rather than poisoning the sum.
  return values.reduce<number>(
    (sum, value) => (typeof value === "number" && Number.isFinite(value) ? sum + value : sum),
    0
  );
}

export interface User {
  name: string;
  age: number;
}

export interface AdvancedUser extends User {
  address?: string;
}

export function introduceAdvancedUser(user: AdvancedUser): string {
  const introduction = "Hello, my name is " + user.name + " and I am " + user.age + " years old.";
  return user.address ? introduction + " I live at " + user.address + "." : introduction;
}

export function welcomeUser(name: string, greeting: string = "Hello"): string {
  return greeting + ", " + name + "!";
}
