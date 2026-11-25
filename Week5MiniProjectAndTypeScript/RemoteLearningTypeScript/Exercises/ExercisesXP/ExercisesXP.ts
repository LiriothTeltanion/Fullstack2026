// Remote Exercises XP: TypeScript from the start
// Run with: node ExercisesXP.ts
// Check with: npx tsc --strict --noEmit ExercisesXP.ts

// Exercise 1: a typed hello function
function hello(name: string): string {
  return `Hello, ${name}. Welcome to TypeScript.`;
}
console.log("1.", hello("Kevin"));

// Exercise 2: explicit types on variables
const course: string = "Fullstack";
const week: number = 5;
const isRemote: boolean = true;
const topics: string[] = ["types", "interfaces", "generics"];
console.log("2.", `${course} week ${week}, remote: ${isRemote}, topics: ${topics.length}`);

// Exercise 3: a union type for an id
type Id = number | string;
function describeId(id: Id): string {
  return typeof id === "number" ? `numeric id ${id}` : `text id "${id.toUpperCase()}"`;
}
console.log("3.", describeId(101), "|", describeId("ab-7"));

// Exercise 4: control flow with if / else if / else
function grade(score: number): string {
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else return "F";
}
console.log("4.", [95, 83, 71, 40].map(grade).join(" "));

// Exercise 5: a tuple with three different types
const student: [string, number, boolean] = ["Lea", 22, true];
const [studentName, age, enrolled] = student;
console.log("5.", `${studentName} is ${age}, enrolled: ${enrolled}`);

// Exercise 6: an interface for an object, with an optional property
interface Person {
  name: string;
  email: string;
  phone?: string;
}
function contactLine(person: Person): string {
  return `${person.name} <${person.email}>${person.phone ? `, ${person.phone}` : ""}`;
}
console.log("6.", contactLine({ name: "Ana", email: "ana@example.com" }));

// Exercise 7: type assertions on a value that comes in as unknown
const fromForm: unknown = "  42  ";
const cleaned = (fromForm as string).trim();
console.log("7.", Number(cleaned) + 8);

// Exercise 8: a switch over string literal types
type Day = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
function dayType(day: Day): string {
  switch (day) {
    case "fri":
    case "sat":
      return "weekend in Israel";
    default:
      return "work day";
  }
}
console.log("8.", dayType("sun"), "|", dayType("sat"));

// Exercise 9: a function with optional and rest parameters
function sum(label: string, ...numbers: number[]): string {
  return `${label}: ${numbers.reduce((total, n) => total + n, 0)}`;
}
console.log("9.", sum("Total"), "|", sum("Total", 4, 8, 15, 16, 23, 42));

export {};
