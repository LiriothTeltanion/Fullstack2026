// Compile this file with --strict --noEmit. These examples are never called.
import type { Car, Manager, Rectangle } from "./CourseClasses.ts";

export function checkClassContracts(manager: Manager, car: Car, rectangle: Rectangle): void {
  // @ts-expect-error Employee keeps salary visible only to its class and subclasses.
  console.log(manager.salary);
  // @ts-expect-error Employee also protects its name from unrelated callers.
  console.log(manager.name);
  // @ts-expect-error The public make property is readonly.
  car.make = "Honda";
  // @ts-expect-error The private model property cannot be read externally.
  console.log(car.model);
  // @ts-expect-error The model is private and readonly.
  car.model = "Civic";
  // @ts-expect-error Rectangle dimensions are readonly through its interface.
  rectangle.width = 5;
  // @ts-expect-error Both dimensions retain the readonly contract.
  rectangle.height = 6;
  car.year = 2026;
  manager.department = "Product";
  rectangle.color = "green";
}
