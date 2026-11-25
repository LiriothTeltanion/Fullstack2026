import assert from "node:assert/strict";
import test from "node:test";
import {
  AdvancedCalculator,
  Circle,
  Employee,
  ExecutiveManager,
  Laptop,
  Manager,
  Shape,
  Smartphone,
  Square,
} from "./class-exercises.ts";

test("inheritance reuses a protected bonus and enforces budget boundaries", () => {
  const manager = new ExecutiveManager("Maya", 35, 1000);
  assert.equal(manager.name, "Maya");
  assert.equal(manager.getSalaryDetails(), "Maya (35): salary 1000, bonus 100");
  assert.equal(manager instanceof Manager, true);
  assert.equal(manager instanceof Employee, true);
  assert.equal(manager.approveBudget(12000), true);
  assert.equal(manager.approveBudget(12001), false);
  assert.throws(() => manager.approveBudget(-1), RangeError);
  assert.throws(() => new Employee("Maya", 2.5, 1000), RangeError);
  assert.throws(() => new Employee("Maya", 35, Infinity), RangeError);
});

test("subclasses share the base shape total and expose their own static types", () => {
  const initial = Shape.totalShapes;
  new Shape();
  const circle = new Circle(2);
  const square = new Square(3);
  assert.equal(Shape.totalShapes, initial + 3);
  assert.equal(Circle.totalShapes, Shape.totalShapes);
  assert.equal(Square.totalShapes, Shape.totalShapes);
  assert.equal(Shape.getType(), "Shape");
  assert.equal(Circle.getType(), "Circle");
  assert.equal(Square.getType(), "Square");
  assert.equal(circle.getArea(), Math.PI * 4);
  assert.equal(square.getArea(), 9);
  assert.throws(() => new Circle(-1), RangeError);
  assert.throws(() => new Square(NaN), RangeError);
  assert.equal(Shape.totalShapes, initial + 3);
});

test("calculator dispatches the supplied function and rejects nonfinite operations", () => {
  const calculator = new AdvancedCalculator(12, 3);
  assert.equal(calculator.add(), 15);
  assert.equal(calculator.subtract(), 9);
  assert.equal(calculator.multiply(), 36);
  assert.equal(
    calculator.operate((a, b) => a / b),
    4
  );
  calculator.b = 0;
  assert.throws(() => calculator.operate((a, b) => a / b), RangeError);
  calculator.a = NaN;
  assert.throws(() => calculator.add(), RangeError);
});

test("a laptop updates mutable details while retaining its serial number", () => {
  const laptop = new Laptop("DEMO-001", "First model", 1500);
  laptop.model = "Second model";
  laptop.price = 1200;
  assert.equal(laptop.getDeviceInfo(), "Serial: DEMO-001, model: Second model, price: 1200");
  assert.equal(laptop.serialNumber, "DEMO-001");
});

test("optional percentage discounts support both boundaries and reject bad input", () => {
  const phone = new Smartphone("Practice phone", 1000, 24);
  assert.equal(phone.getPriceAfterDiscount(), 1000);
  phone.discount = 15;
  assert.equal(phone.getPriceAfterDiscount(), 850);
  phone.discount = 100;
  assert.equal(phone.getPriceAfterDiscount(), 0);
  phone.discount = 0;
  assert.equal(phone.getPriceAfterDiscount(), 1000);
  for (const discount of [-1, 101, NaN, Infinity]) {
    phone.discount = discount;
    assert.throws(() => phone.getPriceAfterDiscount(), RangeError);
  }
  phone.discount = undefined;
  phone.price = -1;
  assert.throws(() => phone.getPriceAfterDiscount(), RangeError);
});
