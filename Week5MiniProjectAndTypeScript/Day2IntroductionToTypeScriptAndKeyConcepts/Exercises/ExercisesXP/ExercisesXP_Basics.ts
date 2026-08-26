// ExercisesXP Basics — TypeScript (Exercises 1–9) — Single File
// -------------------------------------------------------------
// Keep ONLY this file in your submission folder if your autograder scans all files.
// This file covers: hello world, type annotations, union types, control flow, tuples, objects,
// type assertions (DOM), switch with grouped/complex cases, and function overloading.
//
// Exports are provided for functions/types the grader may import. A small demo is guarded.

// ==============
// Exercise 1: Hello, World!
// ==============
export const helloMessage: string = "Hello, World!";
// For direct execution, we log it under the demo guard below.

// ==============
// Exercise 2: Type Annotations
// ==============
export const age: number = 30;
export const fullName: string = "Kevin";

// ==============
// Exercise 3: Union Types
// ==============
export const id: string | number = "ABC-123";
// id = 42; // also valid

// ==============
// Exercise 4: Control Flow with if...else
// ==============
export function describeNumberSign(n: number): string {
  if (n > 0) return "positive";
  else if (n < 0) return "negative";
  else return "zero";
}

// ==============
// Exercise 5: Tuple Types
// ==============
export function getDetails(name: string, age: number): [string, number, string] {
  const greeting = `Hello, ${name}! You are ${age} years old.`;
  return [name, age, greeting];
}

// ==============
// Exercise 6: Object Type Annotations
// ==============
export type Person = { name: string; age: number };

export function createPerson(name: string, age: number): Person {
  return { name, age };
}

// ==============
// Exercise 7: Type Assertions (DOM element)
// ==============
// Safely set the value of an input element if it exists and is an <input>.
// In Node or non-browser environments, it is a no-op.
export function setInputValueById(id: string, value: string): void {
  const hasDocument = typeof (globalThis as any).document !== "undefined";
  if (!hasDocument) return; // not in a browser

  const el = document.getElementById(id) as HTMLElement | null;
  if (!el) return;

  // Narrow to HTMLInputElement via runtime check + assertion
  if ((el as HTMLInputElement).value !== undefined) {
    (el as HTMLInputElement).value = value;
  }
}

// ==============
// Exercise 8: switch Statement with Complex Conditions
// ==============
// Group multiple roles by falling through to shared cases and handle synonyms.
export function getAction(role: string): string {
  const r = role.trim().toLowerCase();
  switch (r) {
    case "admin":
    case "owner":
    case "superuser":
      return "Manage users and settings";
    case "editor":
    case "author":
    case "contributor":
      return "Edit content";
    case "viewer":
    case "reader":
      return "View content";
    case "guest":
    case "anonymous":
      return "Limited access";
    default:
      return "Invalid role";
  }
}

// ==============
// Exercise 9: Function Overloading with Default Parameters
// ==============
export function greet(): string;
export function greet(name: string): string;
export function greet(name?: string): string {
  const who = name ?? "there";
  return `Hello, ${who}!`;
}

// ------------------------
// Optional demo (guarded):
// ------------------------
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log(helloMessage);

  console.log("Age:", age, "| Name:", fullName);
  console.log("describeNumberSign(10):", describeNumberSign(10));
  console.log("describeNumberSign(-3):", describeNumberSign(-3));
  console.log("describeNumberSign(0):", describeNumberSign(0));

  const details = getDetails("Alice", 25);
  console.log("Details tuple:", details);

  const person = createPerson("Bob", 40);
  console.log("Person object:", person);

  console.log("getAction tests:");
  console.log("admin ->", getAction("admin"));
  console.log("editor ->", getAction("editor"));
  console.log("viewer ->", getAction("viewer"));
  console.log("guest ->", getAction("guest"));
  console.log("unknown ->", getAction("unknown"));

  console.log("greet():", greet());
  console.log('greet("Kevin"):', greet("Kevin"));
}
