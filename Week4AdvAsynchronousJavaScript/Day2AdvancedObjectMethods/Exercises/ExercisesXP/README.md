# Objects, Destructuring & Classes — Exercises XP (TypeScript) 🧠🧩

Practice **object destructuring**, **object/array methods**, and **classes with inheritance**.

## ✅ What’s inside
- 1️⃣ Location destructuring → formatted string with lat/lng
- 2️⃣ `displayStudentInfo({first,last})` → "Your full name is ..."
- 3️⃣ Users to entries (and IDs ×2) using `Object.entries` + `map`
- 4️⃣ `Person` class; `typeof new Person('John')` → `"object"`
- 5️⃣ `Dog` → `Labrador` (correct constructor uses `super(name)` then sets fields)
- 6️⃣ Equality & references + `Animal`/`Mammal` with `sound()` → “Moooo I'm a cow, named Lily and I'm brown and white”

## 📂 Files
- `ObjectsDestructuringClassesXP.ts` — all solutions with a small demo block (guarded).

## ▶️ Run locally
```bash
# Using ts-node
npx ts-node ObjectsDestructuringClassesXP.ts

# Or compile to JS and run
npx tsc ObjectsDestructuringClassesXP.ts
node ObjectsDestructuringClassesXP.js
```

## 🧪 Expected snippets
```
I am John Doe from Vancouver, Canada. Latitude(49.2827), Longitude(-123.1207)
Your full name is Elie Schoppik
usersAsEntries: [ [ 'user1', 18273 ], [ 'user2', 92833 ], [ 'user3', 90315 ] ]
usersIdsTimesTwo: [ [ 'user1', 36546 ], [ 'user2', 185666 ], [ 'user3', 180630 ] ]
typeof member: object
eqArrays ([2] === [2]): false
eqObjects ({} === {}): false
vals: { val2: 4, val3: 4, val4: 5 }
Moooo I'm a cow, named Lily and I'm brown and white
```
