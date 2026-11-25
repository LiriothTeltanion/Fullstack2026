import {
  AdvancedCalculator,
  Circle,
  ExecutiveManager,
  Laptop,
  Shape,
  Smartphone,
  Square,
} from "./class-exercises.ts";

const manager = new ExecutiveManager("Maya", 35, 12000);
console.log(
  "Employee:",
  manager.getSalaryDetails(),
  "Budget approved:",
  manager.approveBudget(10000)
);

const startingShapes = Shape.totalShapes;
const circle = new Circle(2);
const square = new Square(3);
console.log("Shapes:", Circle.getType(), circle.getArea(), Square.getType(), square.getArea());
console.log("Shapes created:", Shape.totalShapes - startingShapes);

const calculator = new AdvancedCalculator(12, 3);
console.log(
  "Calculator:",
  calculator.add(),
  calculator.subtract(),
  calculator.multiply(),
  calculator.operate((a, b) => a / b)
);

const laptop = new Laptop("DEMO-001", "Practice notebook", 1500);
laptop.model = "Updated notebook";
laptop.price = 1400;
console.log("Laptop:", laptop.getDeviceInfo());

console.log(
  "Phone prices:",
  new Smartphone("Practice phone", 1000, 24).getPriceAfterDiscount(),
  new Smartphone("Sale phone", 1000, 24, 15).getPriceAfterDiscount()
);
