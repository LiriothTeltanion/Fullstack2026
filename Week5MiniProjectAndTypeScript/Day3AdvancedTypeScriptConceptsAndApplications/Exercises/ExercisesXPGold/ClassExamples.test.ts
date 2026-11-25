import assert from "node:assert/strict";
import test from "node:test";
import {
  Addition,
  Car,
  ColoredRectangle,
  Employee,
  Manager,
  MathUtils,
  Multiplication,
} from "./CourseClasses.ts";
import type { Operation, Rectangle, Shape } from "./CourseClasses.ts";
import { Version } from "./ExercisesXPGold.ts";

test("a manager extends employee details and exposes its department", () => {
  const manager = new Manager("Noa", 15000, "Engineering");
  assert.ok(manager instanceof Employee);
  assert.equal(manager.getDetails(), "Noa earns 15000 in Engineering");
  manager.department = "Product";
  assert.equal(manager.getDetails(), "Noa earns 15000 in Product");
});

test("car details include the private model and mutable year", () => {
  const car = new Car("Toyota", "Yaris", 2024);
  car.year = 2025;
  assert.equal(car.make, "Toyota");
  assert.equal(car.getCarDetails(), "2025 Toyota Yaris");
});

test("circumference uses the static constant and rejects invalid radii", () => {
  assert.equal(MathUtils.PI, 3.14159);
  assert.equal(MathUtils.circumference(2), 12.56636);
  assert.equal(MathUtils.circumference(0), 0);
  for (const radius of [-1, NaN, Infinity, -Infinity]) {
    assert.throws(() => MathUtils.circumference(radius), RangeError);
  }
});

test("the same operation interface supports addition and multiplication", () => {
  const operations: Operation[] = [new Addition(), new Multiplication()];
  assert.deepEqual(
    operations.map(operation => operation.operate(3, 4)),
    [7, 12]
  );
  assert.equal(new Addition().operate(-3, 0.5), -2.5);
  assert.equal(new Multiplication().operate(-3, 0.5), -1.5);
});

test("rectangle implements shape and perimeter contracts", () => {
  const rectangle: Rectangle = new ColoredRectangle("blue", 3, 4);
  const shape: Shape = rectangle;
  assert.equal(shape.getArea(), 12);
  assert.equal(rectangle.getPerimeter(), 14);
  rectangle.color = "green";
  assert.equal(shape.color, "green");
  assert.equal(new ColoredRectangle("blue", 0, 4).getArea(), 0);
  assert.throws(() => new ColoredRectangle("blue", -1, 4), RangeError);
  assert.throws(() => new ColoredRectangle("blue", 3, NaN), RangeError);
});

test("version ordering keeps valid examples and rejects malformed or unsafe parts", () => {
  const versions = ["1.10", "1.2", "0.9"].map(text => new Version(text));
  assert.equal(versions.sort((a, b) => a.compareTo(b)).join(", "), "0.9, 1.2, 1.10");
  assert.equal(new Version("0.0").toString(), "0.0");
  assert.equal(new Version("9007199254740991.0").major, Number.MAX_SAFE_INTEGER);
  for (const text of [
    "bad",
    "1",
    "1.2.3",
    "-1.2",
    "1.-2",
    "1.2x",
    " 1.2",
    "1.2\n",
    "9007199254740992.0",
    "1.9007199254740992",
    "9".repeat(400) + ".1",
  ]) {
    assert.throws(() => new Version(text), RangeError);
  }
});
