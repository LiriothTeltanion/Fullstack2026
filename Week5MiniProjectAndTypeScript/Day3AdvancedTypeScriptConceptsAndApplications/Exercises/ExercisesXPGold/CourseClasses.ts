// Small independent examples of visibility, inheritance and interface contracts.
export class Employee {
  protected name: string;
  protected salary: number;

  constructor(name: string, salary: number) {
    this.name = name;
    this.salary = salary;
  }

  getDetails(): string {
    return `${this.name} earns ${this.salary}`;
  }
}

export class Manager extends Employee {
  public department: string;

  constructor(name: string, salary: number, department: string) {
    super(name, salary);
    this.department = department;
  }

  override getDetails(): string {
    return `${super.getDetails()} in ${this.department}`;
  }
}

export class Car {
  public readonly make: string;
  private readonly model: string;
  public year: number;

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  getCarDetails(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }
}

function requireNonNegativeFinite(value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("A measurement must be a finite, non-negative number.");
  }
}

export class MathUtils {
  static readonly PI = 3.14159;

  static circumference(radius: number): number {
    requireNonNegativeFinite(radius);
    return 2 * MathUtils.PI * radius;
  }
}

export interface Operation {
  operate(a: number, b: number): number;
}

export class Addition implements Operation {
  operate(a: number, b: number): number {
    return a + b;
  }
}

export class Multiplication implements Operation {
  operate(a: number, b: number): number {
    return a * b;
  }
}

export interface Shape {
  color: string;
  getArea(): number;
}

export interface Rectangle extends Shape {
  readonly width: number;
  readonly height: number;
  getPerimeter(): number;
}

export class ColoredRectangle implements Rectangle {
  color: string;
  readonly width: number;
  readonly height: number;

  constructor(color: string, width: number, height: number) {
    requireNonNegativeFinite(width);
    requireNonNegativeFinite(height);
    this.color = color;
    this.width = width;
    this.height = height;
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}
