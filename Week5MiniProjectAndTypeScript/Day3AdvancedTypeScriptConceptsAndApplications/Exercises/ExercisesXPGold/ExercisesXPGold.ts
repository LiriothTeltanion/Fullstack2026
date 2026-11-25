// Exercises XP Gold: classes, access modifiers, abstract classes and interfaces
// Run with: node ExercisesXPGold.ts
// Check with: npx tsc --strict --noEmit ExercisesXPGold.ts

// Exercise 1: an abstract class with an abstract method and a shared method
abstract class Employee {
  private static count = 0; // Exercise 4: a static counter shared by every instance
  readonly id: number;
  protected baseSalary: number;
  name: string;

  constructor(name: string, baseSalary: number) {
    Employee.count++;
    this.id = Employee.count;
    this.name = name;
    this.baseSalary = baseSalary;
  }

  abstract monthlyPay(): number;

  describe(): string {
    return `#${this.id} ${this.name} (${this.constructor.name}) earns ${this.monthlyPay()}`;
  }

  static get total(): number {
    return Employee.count;
  }
}

// Exercise 2: subclasses use the protected baseSalary, outside code cannot
class Engineer extends Employee {
  private overtimeHours: number;

  constructor(name: string, baseSalary: number, overtimeHours: number) {
    super(name, baseSalary);
    this.overtimeHours = overtimeHours;
  }

  monthlyPay(): number {
    return this.baseSalary + this.overtimeHours * 60;
  }
}

class Manager extends Employee {
  private team: Employee[] = [];

  addToTeam(employee: Employee): this {
    this.team.push(employee);
    return this;
  }

  monthlyPay(): number {
    return this.baseSalary + this.team.length * 500;
  }
}

// Exercise 3: an interface that two unrelated classes implement
interface Comparable<T> {
  compareTo(other: T): number;
}

class Version implements Comparable<Version> {
  major: number;
  minor: number;

  constructor(text: string) {
    // A version is exactly major.minor with two safe, non-negative integers.
    if (!/^\d+\.\d+$/.test(text) || text !== text.trim()) {
      throw new RangeError("Version must use non-negative major.minor integers.");
    }
    [this.major, this.minor] = text.split(".").map(Number);
    if (!Number.isSafeInteger(this.major) || !Number.isSafeInteger(this.minor)) {
      throw new RangeError("Version components must be safe integers.");
    }
  }

  compareTo(other: Version): number {
    return this.major - other.major || this.minor - other.minor;
  }

  toString(): string {
    return `${this.major}.${this.minor}`;
  }
}

// Exercise 5: a generic Stack class
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const alice = new Engineer("Alice", 12000, 10);
const bob = new Engineer("Bob", 11000, 0);
const carol = new Manager("Carol", 15000).addToTeam(alice).addToTeam(bob);
[alice, bob, carol].forEach(person => console.log("1-2.", person.describe()));
// alice.baseSalary;  <- error: protected

const versions = ["1.10", "1.2", "0.9"].map(text => new Version(text));
versions.sort((a, b) => a.compareTo(b));
console.log("3. Sorted versions:", versions.join(", "));
console.log("4. Employees created:", Employee.total);

const history = new Stack<string>();
["home", "about", "contact"].forEach(page => history.push(page));
console.log("5. Back from:", history.pop(), "| now on:", history.peek(), "| size:", history.size);

export {};

export { Version };
