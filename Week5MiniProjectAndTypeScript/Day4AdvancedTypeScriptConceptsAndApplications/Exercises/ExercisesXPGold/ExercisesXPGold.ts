// ExercisesXPGold — Advanced TypeScript (Exercises 1–5) — Single File
// -------------------------------------------------------------------
// Run with:  npx ts-node ExercisesXPGold.ts
// Or compile: npx tsc ExercisesXPGold.ts && node ExercisesXPGold.js

// =====================================================
// Exercise 1: Combining Intersection Types with Guards
// =====================================================

interface User {
  name: string;
  email: string;
}

interface Admin {
  adminLevel: number;
}

// Intersection type: has all props from User and Admin
type AdminUser = User & Admin;

/**
 * getProperty: returns the value of a property if it exists, else undefined.
 * Uses the `in` operator as a type guard to check property existence at runtime.
 */
function getProperty(obj: AdminUser, prop: string): unknown {
  if (prop in obj) {
    return (obj as any)[prop];
  }
  return undefined;
}

// ---- Quick test (Ex 1) ----
const adminUser: AdminUser = { name: "Alice", email: "alice@example.com", adminLevel: 3 };
console.log("E1 name:", getProperty(adminUser, "name"));
console.log("E1 email:", getProperty(adminUser, "email"));
console.log("E1 adminLevel:", getProperty(adminUser, "adminLevel"));
console.log("E1 missing:", getProperty(adminUser, "unknown"));

// ==================================
// Exercise 2: Type Casting w/Generics
// ==================================

/**
 * castToType: generic helper that uses a constructor/mapper to convert a value.
 * Note: In TypeScript, "casting" is a compile-time assertion and does not convert.
 * This function performs a real runtime conversion using the provided constructor.
 */
function castToType<T>(value: unknown, ctor: (arg: any) => T): T {
  return ctor(value as any);
}

// ---- Quick test (Ex 2) ----
const n1 = castToType<number>("123.45", Number);
const b1 = castToType<boolean>("true", v => String(v).toLowerCase() === "true");
console.log("E2 number:", n1);
console.log("E2 boolean:", b1);

// ===================================================
// Exercise 3: Type Assertions with Generic Constraints
// ===================================================

/**
 * getArrayLength: returns the length of an array,
 * constrained to arrays of numbers or arrays of strings.
 */
function getArrayLength<T extends Array<number> | Array<string>>(items: T): number {
  return items.length;
}

// ---- Quick test (Ex 3) ----
console.log("E3 len [1,2,3]:", getArrayLength([1, 2, 3]));
console.log('E3 len ["a","b"]:', getArrayLength(["a", "b"]));

// ================================================
// Exercise 4: Generic Interfaces with Class Impl.
// ================================================

interface Storage<T> {
  add(item: T): void;
  get(index: number): T | undefined;
}

class Box<T> implements Storage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  size(): number {
    return this.items.length;
  }
}

// ---- Quick test (Ex 4) ----
const boxNum = new Box<number>();
boxNum.add(10);
boxNum.add(20);
console.log("E4 boxNum[0]:", boxNum.get(0));
console.log("E4 boxNum size:", boxNum.size());

const boxStr = new Box<string>();
boxStr.add("x");
boxStr.add("y");
console.log("E4 boxStr[1]:", boxStr.get(1));
console.log("E4 boxStr size:", boxStr.size());

// ==========================================================
// Exercise 5: Combining Generic Classes with Constraints
// ==========================================================

interface Item<T> {
  value: T;
}

class Queue<T> {
  private q: Item<T>[] = [];

  add(item: Item<T>): void {
    this.q.push(item);
  }

  remove(): Item<T> | undefined {
    return this.q.shift();
  }

  peek(): Item<T> | undefined {
    return this.q[0];
  }

  length(): number {
    return this.q.length;
  }

  isEmpty(): boolean {
    return this.q.length === 0;
  }
}

// ---- Quick test (Ex 5) ----
const qNum = new Queue<number>();
qNum.add({ value: 100 });
qNum.add({ value: 200 });
console.log("E5 qNum peek:", qNum.peek());
console.log("E5 qNum remove:", qNum.remove());
console.log("E5 qNum length:", qNum.length());

const qStr = new Queue<string>();
qStr.add({ value: "alpha" });
qStr.add({ value: "beta" });
console.log("E5 qStr remove:", qStr.remove());
console.log("E5 qStr peek:", qStr.peek());
console.log("E5 qStr isEmpty:", qStr.isEmpty());
