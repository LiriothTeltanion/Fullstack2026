// ExercisesXP — Advanced TypeScript Exercises (1–7) — Single File
// ---------------------------------------------------------------
// Run with:  npx ts-node ExercisesXP.ts
// Or compile: npx tsc ExercisesXP.ts && node ExercisesXP.js

// Exercise 1: Intersection Types
type Person = { name: string; age: number };
type Address = { street: string; city: string };
type PersonWithAddress = Person & Address;

const kevinHome: PersonWithAddress = {
  name: "Kevin",
  age: 30,
  street: "Herzl 1",
  city: "Beersheba",
};

// Exercise 2: Type Guards with Union Types
function describeValue(v: number | string): string {
  if (typeof v === "number") return "This is a number";
  return "This is a string";
}

// Exercise 3: Type Casting (Type Assertions)
// In TypeScript, "casting" is a compile-time type assertion; it does NOT convert the value at runtime.
// For actual conversion use String(value) or value.toString().
const someValue: any = 12345;
const casted: string = someValue as string; // assertion (types only, no runtime conversion)
const safeString: string = String(someValue); // real runtime conversion

// Exercise 4: Type Assertions with Union Types
function getFirstElement(arr: Array<number | string>): string {
  const first = arr[0];
  if (typeof first === "string") {
    return first as string;
  }
  return first.toString() as string; // number -> string
}

// Exercise 5: Generic Constraints
function logLength<T extends { length: number }>(arg: T): number {
  console.log("Length is:", arg.length);
  return arg.length;
}

// Exercise 6: Intersection Types and Type Guards
type Job = { position: string; department: string };
type Employee = Person & Job;

function describeEmployee(e: Employee): string {
  const pos = e.position.toLowerCase();
  if (pos.includes("manager")) {
    return `${e.name} (age ${e.age}) manages the ${e.department} department.`;
  }
  if (pos.includes("developer") || pos.includes("engineer")) {
    return `${e.name} (age ${e.age}) develops for the ${e.department} team.`;
  }
  return `${e.name} (age ${e.age}) works as ${e.position} in ${e.department}.`;
}

// Exercise 7: Type Assertions and Generic Constraints
function formatInput<T extends { toString(): string }>(input: T): string {
  const str = input.toString() as string;
  return `«${str.trim()}»`;
}

// -----------------------------------------------------
// Quick tests (console)
console.log("E1:", kevinHome);

console.log("E2 number:", describeValue(42));
console.log("E2 string:", describeValue("hello"));

console.log("E3 casted (static):", casted);
console.log("E3 safeString (runtime):", safeString);

console.log('E4 [1,"b"]:', getFirstElement([1, "b"]));
console.log('E4 ["x", 2]:', getFirstElement(["x", 2]));

logLength("TypeScript");
logLength([1, 2, 3, 4]);

const emp1: Employee = { name: "Ada", age: 34, position: "Manager", department: "R&D" };
const emp2: Employee = { name: "Linus", age: 29, position: "Developer", department: "Platform" };
console.log("E6 Ada:", describeEmployee(emp1));
console.log("E6 Linus:", describeEmployee(emp2));

console.log("E7 number:", formatInput(123.45));
console.log("E7 date:", formatInput(new Date("2025-03-21")));
