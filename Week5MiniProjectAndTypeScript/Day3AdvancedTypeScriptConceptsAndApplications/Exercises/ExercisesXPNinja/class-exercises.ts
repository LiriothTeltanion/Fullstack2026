// Small class models with explicit access boundaries and reusable contracts.
export class Employee {
  public name: string;
  private age: number;
  protected salary: number;

  constructor(name: string, age: number, salary: number) {
    if (!Number.isInteger(age) || age < 0)
      throw new RangeError("Age must be a nonnegative integer.");
    if (!Number.isFinite(salary) || salary < 0)
      throw new RangeError("Salary must be finite and nonnegative.");
    this.name = name;
    this.age = age;
    this.salary = salary;
  }

  protected calculateBonus(): number {
    return this.salary * 0.1;
  }

  public getSalaryDetails(): string {
    return `${this.name} (${this.age}): salary ${this.salary}`;
  }
}

export class Manager extends Employee {
  public override getSalaryDetails(): string {
    return `${super.getSalaryDetails()}, bonus ${this.calculateBonus()}`;
  }
}

export class ExecutiveManager extends Manager {
  // The model treats salary as monthly and allows an annual salary budget.
  public approveBudget(amount: number): boolean {
    if (!Number.isFinite(amount) || amount < 0)
      throw new RangeError("Budget must be finite and nonnegative.");
    return amount <= this.salary * 12;
  }
}

export class Shape {
  public static totalShapes = 0;

  constructor() {
    // Always update the base counter so every subclass contributes to one total.
    Shape.totalShapes += 1;
  }

  public static getType(): string {
    return "Shape";
  }
}

export class Circle extends Shape {
  public radius: number;

  constructor(radius: number) {
    if (!Number.isFinite(radius) || radius < 0)
      throw new RangeError("Radius must be finite and nonnegative.");
    super();
    this.radius = radius;
  }

  public static override getType(): string {
    return "Circle";
  }

  public getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

export class Square extends Shape {
  public side: number;

  constructor(side: number) {
    if (!Number.isFinite(side) || side < 0)
      throw new RangeError("Side must be finite and nonnegative.");
    super();
    this.side = side;
  }

  public static override getType(): string {
    return "Square";
  }

  public getArea(): number {
    return this.side ** 2;
  }
}

export interface Calculator {
  a: number;
  b: number;
  operate(operation: (a: number, b: number) => number): number;
}

export class AdvancedCalculator implements Calculator {
  public a: number;
  public b: number;

  constructor(a: number, b: number) {
    this.a = a;
    this.b = b;
  }

  public operate(operation: (a: number, b: number) => number): number {
    if (!Number.isFinite(this.a) || !Number.isFinite(this.b))
      throw new RangeError("Operands must be finite.");
    const result = operation(this.a, this.b);
    if (!Number.isFinite(result))
      throw new RangeError("The operation must return a finite result.");
    return result;
  }

  public add(): number {
    return this.operate((a, b) => a + b);
  }

  public subtract(): number {
    return this.operate((a, b) => a - b);
  }

  public multiply(): number {
    return this.operate((a, b) => a * b);
  }
}

export class Device {
  public readonly serialNumber: string;

  constructor(serialNumber: string) {
    this.serialNumber = serialNumber;
  }

  public getDeviceInfo(): string {
    return `Serial: ${this.serialNumber}`;
  }
}

export class Laptop extends Device {
  public model: string;
  public price: number;

  constructor(serialNumber: string, model: string, price: number) {
    super(serialNumber);
    this.model = model;
    this.price = price;
  }

  public override getDeviceInfo(): string {
    return `${super.getDeviceInfo()}, model: ${this.model}, price: ${this.price}`;
  }
}

export interface Product {
  readonly name: string;
  price: number;
  discount?: number;
}

export interface Electronics extends Product {
  warrantyPeriod: number;
}

export class Smartphone implements Electronics {
  public readonly name: string;
  public price: number;
  public discount?: number;
  public warrantyPeriod: number;

  constructor(name: string, price: number, warrantyPeriod: number, discount?: number) {
    this.name = name;
    this.price = price;
    this.warrantyPeriod = warrantyPeriod;
    this.discount = discount;
  }

  // A discount is a percentage in [0, 100]; omitting it means full price.
  public getPriceAfterDiscount(): number {
    const discount = this.discount ?? 0;
    if (!Number.isFinite(this.price) || this.price < 0)
      throw new RangeError("Price must be finite and nonnegative.");
    if (!Number.isFinite(discount) || discount < 0 || discount > 100)
      throw new RangeError("Discount must be between 0 and 100 percent.");
    return this.price * (1 - discount / 100);
  }
}
