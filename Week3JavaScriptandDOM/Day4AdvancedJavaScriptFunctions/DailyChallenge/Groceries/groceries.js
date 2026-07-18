// Daily Challenge — Groceries
// Short & simple solution with English comments (no frameworks).

// Primitive variable (string) — copied by VALUE
let client = "John";

// Object — assigned by REFERENCE
const groceries = {
  fruits: ["pear", "apple", "banana"],
  vegetables: ["tomatoes", "cucumber", "salad"],
  totalPrice: "20$",
  other: {
    paid: true,
    meansOfPayment: ["cash", "creditCard"],
  },
};

// 1) Arrow function: log all fruits using forEach
const displayGroceries = () => {
  // Loop the fruits array and print each item
  groceries.fruits.forEach(fruit => console.log(fruit));
};

// 2) Arrow function: demonstrate cloning vs referencing
const cloneGroceries = () => {
  console.log("---- cloneGroceries() ----");

  // Copy the primitive (by value). 'user' receives a COPY of the string.
  const user = client;
  console.log("Before change -> client:", client, "| user:", user);

  // Change the original primitive
  client = "Betty";

  // 'user' does NOT change because strings are copied by value
  console.log("After change  -> client:", client, "| user:", user);
  console.log("// Explanation: primitives (string, number, boolean, etc.) are copied by VALUE.");

  // Reference the groceries object (no real clone here)
  const shopping = groceries; // Both variables reference the same object
  console.log(
    "\nBefore changes -> groceries.totalPrice:",
    groceries.totalPrice,
    "| groceries.other.paid:",
    groceries.other.paid
  );

  // Change nested fields through 'shopping'
  shopping.totalPrice = "35$";
  shopping.other.paid = false;

  // Changes are visible via 'groceries' because 'shopping' is the SAME reference
  console.log(
    "After changes  -> groceries.totalPrice:",
    groceries.totalPrice,
    "| groceries.other.paid:",
    groceries.other.paid
  );
  console.log("// Explanation: objects/arrays are assigned by REFERENCE, so mutations are shared.");

  // (Optional) Show how to make an independent deep copy
  const safeCopy = structuredClone(groceries); // modern deep clone
  safeCopy.totalPrice = "999$";
  safeCopy.other.paid = true;
  console.log(
    "\nDeep copy test -> safeCopy.totalPrice:",
    safeCopy.totalPrice,
    "| groceries.totalPrice:",
    groceries.totalPrice
  );
  console.log(
    "Deep copy paid  -> safeCopy.other.paid:",
    safeCopy.other.paid,
    "| groceries.other.paid:",
    groceries.other.paid
  );
  console.log(
    "// Using structuredClone (or JSON.parse(JSON.stringify(...))) creates a SEPARATE object."
  );
};

// Wire buttons (so you can trigger from the page too)
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn1").addEventListener("click", displayGroceries);
  document.getElementById("btn2").addEventListener("click", cloneGroceries);
  document.getElementById("btn3").addEventListener("click", () => {
    displayGroceries();
    cloneGroceries();
  });
});

// Auto-run once so there is output immediately when opening the page
// (You can comment these out if you prefer manual testing)
// displayGroceries();
// cloneGroceries();
