// Exercises XP Ninja: generics, discriminated unions, overloads and unknown
// Run with: node ExercisesXPNinja.ts
// Check with: npx tsc --strict --noEmit ExercisesXPNinja.ts

// Exercise 1: a generic function that keeps the type of the array it gets
function firstOrDefault<T>(items: T[], fallback: T): T {
  return items.length > 0 ? items[0] : fallback;
}
const firstWord: string = firstOrDefault(["alpha", "beta"], "none");
const firstNumber: number = firstOrDefault([], 0);
console.log("1.", firstWord, firstNumber);

// Exercise 2: a discriminated union; `kind` tells TypeScript which shape it is
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return (shape.base * shape.height) / 2;
  }
}

const shapes: Shape[] = [
  { kind: "circle", radius: 2 },
  { kind: "rectangle", width: 3, height: 4 },
  { kind: "triangle", base: 6, height: 5 },
];
shapes.forEach(shape => console.log(`2. ${shape.kind}: ${area(shape).toFixed(2)}`));

// Exercise 3: a type-safe groupBy; the key function must return a string
function groupBy<T>(items: T[], getKey: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
  }
  return groups;
}
const byKind = groupBy(["cat", "cow", "dog", "duck", "crow"], word => word[0]);
console.log("3.", byKind);

// Exercise 4: function overloads (two signatures, one implementation)
function double(value: number): number;
function double(value: string): string;
function double(value: number | string): number | string {
  return typeof value === "number" ? value * 2 : value.repeat(2);
}
const doubledNumber: number = double(21);
const doubledText: string = double("ha");
console.log("4.", doubledNumber, doubledText);

// Exercise 5: parse unknown JSON safely with a user-defined type guard
type Product = { name: string; price: number };

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Product).name === "string" &&
    typeof (value as Product).price === "number"
  );
}

const inputs = ['{"name":"Keyboard","price":250}', '{"name":"Mouse"}', "not json"];
for (const text of inputs) {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    console.log("5. invalid JSON:", text);
    continue;
  }
  console.log("5.", isProduct(data) ? `${data.name} costs ${data.price}` : "not a product:", text);
}

export {};
