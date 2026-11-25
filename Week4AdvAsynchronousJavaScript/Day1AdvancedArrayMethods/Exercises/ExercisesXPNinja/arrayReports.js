// Run with node arrayReports.js. The same reports use two different traversal styles.
export function dogYearsWithLoop(pets) {
  let years = 0;
  for (const pet of pets) {
    if (pet.type === "dog") years += pet.age * 7;
  }
  return years;
}

export function dogYearsWithReduce(pets) {
  return pets.reduce((years, pet) => years + (pet.type === "dog" ? pet.age * 7 : 0), 0);
}

export const cleanEmail = email => email.replace(/\s+/gu, "");
export const rolesByName = people =>
  Object.fromEntries(
    people.map(({ firstName, lastName, role }) => [firstName + " " + lastName, role])
  );

export function countWithLoop(values) {
  const counts = Object.create(null);
  for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  return counts;
}

export function countWithReduce(values) {
  return values.reduce((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, Object.create(null));
}

if (import.meta.main) {
  const pets = [
    { type: "dog", age: 3 },
    { type: "rabbit", age: 5 },
    { type: "dog", age: 6 },
    { type: "cat", age: 1 },
    { type: "dog", age: 3 },
    { type: "dog", age: 10 },
  ];
  console.log("Dog years (loop / reduce):", dogYearsWithLoop(pets), dogYearsWithReduce(pets));
  console.log("Clean email:", cleanEmail("   hello@example.com  "));
  console.log("Roles:", rolesByName([{ firstName: "Dana", lastName: "Levi", role: "Mentor" }]));
  console.log(
    "Letter counts:",
    countWithLoop(["x", "y", "z", "z"]),
    countWithReduce(["x", "y", "z", "z"])
  );
}
