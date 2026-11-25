// Exercises XP Ninja: advanced array methods
// Run with: node arrayMethodsNinja.js

// Exercise 1: group words by their first letter with reduce()
const words = ["apple", "avocado", "banana", "blueberry", "cherry", "apricot"];

const groupByFirstLetter = list =>
  list.reduce((groups, word) => {
    const letter = word[0];
    groups[letter] = groups[letter] || [];
    groups[letter].push(word);
    return groups;
  }, {});

console.log("1. Grouped:", groupByFirstLetter(words));

// Exercise 2: flatten any depth with reduce() + recursion, then compare with flat(Infinity)
const nested = [1, [2, [3, [4, 5]], 6], [[7]], 8];

const deepFlatten = list =>
  list.reduce(
    (flat, item) => (Array.isArray(item) ? flat.concat(deepFlatten(item)) : flat.concat(item)),
    []
  );

console.log("2. deepFlatten:", deepFlatten(nested));
console.log("   flat(Infinity):", nested.flat(Infinity));

// Exercise 3: chain filter(), map() and reduce() on a list of students
const students = [
  { name: "Ray", course: "Computer Science", grade: 91 },
  { name: "Liam", course: "Computer Science", grade: 58 },
  { name: "Jenner", course: "Information Technology", grade: 64 },
  { name: "Marco", course: "Robotics", grade: 88 },
  { name: "Kimberly", course: "Artificial Intelligence", grade: 45 },
  { name: "Jamie", course: "Big Data", grade: 77 },
];

const passed = students.filter(student => student.grade >= 60);
const passedNames = passed.map(student => student.name);
const passedAverage = passed.reduce((sum, student) => sum + student.grade, 0) / passed.length;

console.log("3. Passed:", passedNames.join(", "));
console.log("   Average of those who passed:", passedAverage.toFixed(1));

// Exercise 4: find the duplicates with filter() and indexOf()
const numbers = [4, 7, 2, 7, 9, 4, 4, 1];
const duplicates = numbers.filter(
  (value, index) => numbers.indexOf(value) !== index && numbers.lastIndexOf(value) === index
);
console.log("4. Duplicates:", duplicates);

// Exercise 5: zip two arrays together with map()
const fruits = ["kiwi", "mango", "plum"];
const prices = [2.5, 4, 1.75];
const zipped = fruits.map((fruit, i) => ({ fruit, price: prices[i] }));
console.log("5. Zipped:", zipped);
