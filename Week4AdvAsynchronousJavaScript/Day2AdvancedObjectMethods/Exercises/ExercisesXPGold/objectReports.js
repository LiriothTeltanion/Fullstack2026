export function printFullName({ first, last }) {
  return "Your full name is " + first + " " + last;
}

export function keysAndValues(record) {
  const keys = Object.keys(record).sort();
  return [keys, keys.map(key => record[key])];
}

export class Counter {
  count = 0;

  increment() {
    this.count += 1;
  }
}

if (import.meta.main) {
  console.log(printFullName({ first: "Dana", last: "Levi" }));
  console.log(keysAndValues({ z: "last", a: "first" }));
  const original = new Counter();
  original.increment();
  original.increment();
  const alias = original;
  alias.increment();
  // Both variables refer to the same counter, so the original now holds 3.
  console.log(original.count);
}
