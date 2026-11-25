// Exercises XP Ninja: objects, classes, getters and setters
// Run with: node objectMethodsNinja.js

// Exercise 1: a class with a getter, a setter that validates, and a static method
class Temperature {
  #celsius;

  constructor(celsius) {
    this.celsius = celsius; // goes through the setter
  }

  get celsius() {
    return this.#celsius;
  }

  set celsius(value) {
    if (typeof value !== "number" || value < -273.15) {
      throw new RangeError(`Invalid temperature: ${value}`);
    }
    this.#celsius = value;
  }

  get fahrenheit() {
    return (this.#celsius * 9) / 5 + 32;
  }

  static fromFahrenheit(fahrenheit) {
    return new Temperature(((fahrenheit - 32) * 5) / 9);
  }
}

const today = new Temperature(24);
console.log("1.", today.celsius, "C is", today.fahrenheit, "F");
console.log("   98.6 F is", Temperature.fromFahrenheit(98.6).celsius.toFixed(1), "C");
try {
  today.celsius = -300;
} catch (error) {
  console.log("  ", error.message);
}

// Exercise 2: deep equality, comparing nested objects key by key
function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) {
    return false;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key => deepEqual(a[key], b[key]));
}

const user1 = { name: "Ana", address: { city: "Haifa", zip: [3, 1] } };
const user2 = { name: "Ana", address: { city: "Haifa", zip: [3, 1] } };
console.log("2. === says", user1 === user2, "| deepEqual says", deepEqual(user1, user2));
console.log("   Different city:", deepEqual(user1, { ...user2, address: { city: "Eilat" } }));

// Exercise 3: pick() and omit() built from Object.entries() and Object.fromEntries()
const pick = (obj, keys) =>
  Object.fromEntries(keys.filter(key => key in obj).map(key => [key, obj[key]]));
const omit = (obj, keys) =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key)));

const account = { id: 7, username: "lirioth", password: "secret", email: "me@example.com" };
console.log("3. pick:", pick(account, ["id", "username"]));
console.log("   omit:", omit(account, ["password"]));

// Exercise 4: a non-enumerable property with Object.defineProperty()
const product = { name: "Headphones", price: 250 };
Object.defineProperty(product, "internalCode", { value: "HP-250-X", enumerable: false });
console.log("4. keys():", Object.keys(product), "| still readable:", product.internalCode);
console.log("   JSON:", JSON.stringify(product));

// Exercise 5: method chaining by returning `this`
const cart = {
  items: [],
  add(name, price) {
    this.items.push({ name, price });
    return this;
  },
  total() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  },
};
console.log("5. Cart total:", cart.add("Book", 40).add("Pen", 5).add("Mug", 30).total());
