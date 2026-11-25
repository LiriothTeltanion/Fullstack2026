import type { Calculator, Electronics } from "./class-exercises.ts";
import { Employee, ExecutiveManager, Laptop, Smartphone } from "./class-exercises.ts";

// This function is compiled, but never called. Each directive must match a real
// compiler error, so removing an access or readonly boundary fails typechecking.
export function verifyTypeBoundaries(
  employee: Employee,
  manager: ExecutiveManager,
  laptop: Laptop,
  phone: Smartphone,
  calculator: Calculator,
  electronics: Electronics
): void {
  // @ts-expect-error Age is private to Employee.
  void employee.age;
  // @ts-expect-error Salary is accessible only inside the inheritance tree.
  void manager.salary;
  // @ts-expect-error Bonus calculation is protected.
  manager.calculateBonus();
  // @ts-expect-error Device serial numbers are readonly.
  laptop.serialNumber = "CHANGED";
  // @ts-expect-error A product name is readonly in the implementation.
  phone.name = "CHANGED";
  // @ts-expect-error The interface retains its readonly property.
  electronics.name = "CHANGED";
  // @ts-expect-error An operation must accept and return numbers.
  calculator.operate((a: string, b: string) => a + b);
  // @ts-expect-error A discount uses a numeric percentage.
  electronics.discount = "15%";
}
