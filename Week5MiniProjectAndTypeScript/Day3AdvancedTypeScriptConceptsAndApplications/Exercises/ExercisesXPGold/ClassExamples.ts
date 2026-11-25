import {
  Addition,
  Car,
  ColoredRectangle,
  Manager,
  MathUtils,
  Multiplication,
} from "./CourseClasses.ts";

console.log("Manager:", new Manager("Noa", 15000, "Engineering").getDetails());
const car = new Car("Toyota", "Yaris", 2024);
car.year = 2025;
console.log("Car:", car.getCarDetails());
console.log("Circumference:", MathUtils.circumference(2));
console.log("Operations:", new Addition().operate(3, 4), new Multiplication().operate(3, 4));
const rectangle = new ColoredRectangle("blue", 3, 4);
console.log("Rectangle:", rectangle.getArea(), rectangle.getPerimeter());
