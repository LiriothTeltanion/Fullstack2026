# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-1913cdd331.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Six exercises in one TypeScript file about object destructuring, object methods, classes and object references.

## ▶️ How to run

From this folder:

```bash
npx tsc ObjectsDestructuringClassesXP.ts --module commonjs --outDir ~/tmp-ts
node ~/tmp-ts/ObjectsDestructuringClassesXP.js
```

The demo block only runs as CommonJS (`require.main === module`), and inside this repository `.js` files are ES modules, so I compile it to a folder outside the repo first. `tsc` also warns (TS2839) that `[2] === [2]` and `{} === {}` are always false, which is the point of exercise 6, and still writes the file.

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

## 🎯 The challenge

1. **Location** — nested destructuring pulls the name, city, country and coordinates out of `person`.
2. **`displayStudentInfo({ first, last })`** — destructures its parameter and returns `Your full name is ...`.
3. **Users** — `Object.entries(users)` turns the object into pairs, then `map` doubles every ID.
4. **`Person`** — `typeof new Person("John")` is `"object"`.
5. **`Labrador extends Dog`** — the right constructor calls `super(name)` before setting `size`.
6. **References** — two arrays or objects that look the same are not equal; `object2` and `object3` point to `object1`, so changing it changes them. `Mammal.sound()` builds the cow sentence.

## 🧠 What I learned

- Destructuring can rename (`name: pName`) and go several levels deep
- `===` on objects compares references, not contents
- A subclass constructor must call `super()` before using `this`

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 2 - Advanced Object Methods - Exercises XP
