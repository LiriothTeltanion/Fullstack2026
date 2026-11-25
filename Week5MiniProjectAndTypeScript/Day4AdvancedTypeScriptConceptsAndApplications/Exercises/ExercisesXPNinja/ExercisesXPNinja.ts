// Exercises XP Ninja: conditional types, type guards, utility types and template literals
// Run with: node ExercisesXPNinja.ts
// Check with: npx tsc --strict --noEmit ExercisesXPNinja.ts

// Exercise 1: a conditional type that unwraps arrays and promises
type Unwrap<T> = T extends Promise<infer U> ? U : T extends (infer V)[] ? V : T;

const fromArray: Unwrap<string[]> = "only a string fits here";
const fromPromise: Unwrap<Promise<number>> = 42;
const unchanged: Unwrap<boolean> = true;
console.log("1.", fromArray, fromPromise, unchanged);

// Exercise 2: user-defined type guards on a union of classes
class Fish {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  swim(): string {
    return `${this.name} swims`;
  }
}

class Bird {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  fly(): string {
    return `${this.name} flies`;
  }
}

function isFish(pet: Fish | Bird): pet is Fish {
  return pet instanceof Fish;
}

const pets: Array<Fish | Bird> = [new Fish("Nemo"), new Bird("Tweety"), new Fish("Dory")];
pets.forEach(pet => console.log("2.", isFish(pet) ? pet.swim() : pet.fly()));

// Exercise 3: ReturnType and Parameters read the types of an existing function
function createOrder(customer: string, items: string[], express = false) {
  return { customer, items, express, createdAt: new Date(2026, 0, 15) };
}

type Order = ReturnType<typeof createOrder>;
type OrderArgs = Parameters<typeof createOrder>;

const args: OrderArgs = ["Dana", ["guitar strings", "picks"], true];
const order: Order = createOrder(...args);
console.log("3.", order.customer, order.items.length, "items, express:", order.express);

// Exercise 4: template literal types build string types from other types
type Entity = "user" | "post";
type Action = "created" | "deleted";
type EventName = `${Entity}:${Action}`; // "user:created" | "user:deleted" | ...

function logEvent(event: EventName, id: number): string {
  const [entity, action] = event.split(":");
  return `${entity} #${id} was ${action}`;
}
console.log("4.", logEvent("user:created", 7), "|", logEvent("post:deleted", 3));
// logEvent("user:updated", 1);  <- error: not one of the four names

// Exercise 5: Omit, Required and Pick, plus `satisfies`
interface Settings {
  theme: "dark" | "light";
  fontSize?: number;
  language?: string;
  apiUrl: string;
}

type PublicSettings = Omit<Settings, "apiUrl">;
type FullSettings = Required<Settings>;
type ThemeOnly = Pick<Settings, "theme">;

const defaults = {
  theme: "dark",
  fontSize: 16,
  language: "en",
  apiUrl: "http://localhost:3000",
} satisfies FullSettings;

function toPublic({ theme, fontSize, language }: FullSettings): PublicSettings {
  return { theme, fontSize, language };
}
const themeOnly: ThemeOnly = { theme: defaults.theme };
console.log("5.", toPublic(defaults), themeOnly);

export {};
