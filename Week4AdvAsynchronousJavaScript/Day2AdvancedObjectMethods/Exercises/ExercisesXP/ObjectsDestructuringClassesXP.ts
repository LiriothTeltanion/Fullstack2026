// Objects, Destructuring & Classes — Exercises XP (TypeScript, Single File)
// -------------------------------------------------------------------------
// Covers: object destructuring, object/array methods, classes, inheritance.
// Exports allow import-based checks. A small demo is included (guarded).

// ==============
// Exercise 1 : Location (destructuring)
// ==============
export const person = {
  name: "John Doe",
  age: 25,
  location: {
    country: "Canada",
    city: "Vancouver",
    coordinates: [49.2827, -123.1207] as [number, number],
  },
};

const {
  name: pName,
  location: {
    country,
    city,
    coordinates: [lat, lng],
  },
} = person;
export const locationLine = `I am ${pName} from ${city}, ${country}. Latitude(${lat}), Longitude(${lng})`;

// ==============
// Exercise 2: Display Student Info (parameter destructuring)
// ==============
export function displayStudentInfo({ first, last }: { first: string; last: string }): string {
  return `Your full name is ${first} ${last}`;
}

// ==============
// Exercise 3: User & id (Object.entries + map)
// ==============
export const users: Record<string, number> = { user1: 18273, user2: 92833, user3: 90315 };

export const usersAsEntries: [string, number][] = Object.entries(users).map(
  ([k, v]) => [k, v] as [string, number]
);

export const usersIdsTimesTwo: [string, number][] = usersAsEntries.map(
  ([k, v]) => [k, v * 2] as [string, number]
);

// ==============
// Exercise 4 : Person class (typeof instance)
// ==============
export class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export const member = new Person("John");
export const typeofMember = typeof member; // -> 'object'

// ==============
// Exercise 5 : Dog class (extends)
// ==============
export class Dog {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

// Correct option is #2: call super(name) then set subclass fields.
export class Labrador extends Dog {
  size: string;
  constructor(name: string, size: string) {
    super(name);
    this.size = size;
  }
}

// ==============
// Exercise 6 : Challenges
// ==============
export const eqArrays = [2] === [2]; // false (different references)
export const eqObjects = {} === {}; // false (different references)

export const object1 = { number: 5 };
export const object2 = object1;
export const object3 = object2;
export const object4 = { number: 5 };

object1.number = 4;
// Results:
export const val2 = object2.number; // 4 (same reference as object1)
export const val3 = object3.number; // 4 (same reference chain)
export const val4 = object4.number; // 5 (separate object)

// Classes: Animal & Mammal
export class Animal {
  name: string;
  type: string;
  color: string;
  constructor(name: string, type: string, color: string) {
    this.name = name;
    this.type = type;
    this.color = color;
  }
}

export class Mammal extends Animal {
  sound(soundStr: string): string {
    // Using a template string as requested
    return `${soundStr} I'm a ${this.type}, named ${this.name} and I'm ${this.color}`;
  }
}

export const farmerCow = new Mammal("Lily", "cow", "brown and white");
export const farmerCowLine = farmerCow.sound("Moooo");

// ------------------------
// Optional demo (guarded):
// ------------------------
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log(locationLine);
  console.log(displayStudentInfo({ first: "Elie", last: "Schoppik" }));
  console.log("usersAsEntries:", usersAsEntries);
  console.log("usersIdsTimesTwo:", usersIdsTimesTwo);
  console.log("typeof member:", typeofMember);
  console.log("eqArrays ([2] === [2]):", eqArrays);
  console.log("eqObjects ({} === {}):", eqObjects);
  console.log("vals:", { val2, val3, val4 });
  console.log(farmerCowLine); // Moooo I'm a cow, named Lily and I'm brown and white
}
