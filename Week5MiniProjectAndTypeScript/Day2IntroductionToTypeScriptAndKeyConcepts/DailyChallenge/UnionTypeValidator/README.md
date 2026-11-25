# 💪 Daily Challenge - Union Type Validator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/union-type-validator-805b55c1bb.svg" width="100%" alt="Progress card for Union Type Validator">

</div>

A small checker: `validateUnionType(value, allowedTypes)` gets a value and a list of type names, and says `true` when `typeof value` is in the list.

## ▶️ How to run

This folder has its own `package.json`, so run these from here:

```bash
npm install     # typescript and @types/node
npm start       # compiles to dist/ (git-ignored) and runs dist/index.js
```

`npm run build` only compiles, and `npm run dev` keeps `tsc` watching. From the repository root I can type-check it with:

```bash
npm run typecheck:anchor
```

```
📝 Test Case 1: String Validation
Value: "Alice"
Type: string
Allowed Types: ["string", "number"]
✅ Is Valid: true
```

## 🎯 The challenge

```typescript
function validateUnionType(value: any, allowedTypes: string[]): boolean {
  const valueType = typeof value;
  for (const allowedType of allowedTypes) {
    if (valueType === allowedType) return true;
  }
  return false;
}
```

There is a second version, `validateUnionTypeAlt`, that is just `allowedTypes.includes(typeof value)`. The script prints both on the same value to show they agree.

`src/index.ts` runs ten cases and prints the value, its type, the allowed list and the answer: string, number, boolean (meant to fail), object, array, function, undefined, a `string | number` variable, symbol (meant to fail) and bigint. At the end a form example checks `username`, `age`, `isSubscribed`, `userId` and `invalidField`. That last one is `null`, so it comes out INVALID because `typeof null` is `"object"`.

## 🧠 What I learned

- `string | number` is gone after compiling; at runtime all I have is `typeof`
- An array passes as `"object"`, so this check can't tell an array from a plain object without `Array.isArray()`
- A `for...of` loop with an early `return true` and `includes()` give the same result; the second is one line
- Typing the form rows with a `FormField` interface made the `forEach` at the end easy to write

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 2 - TypeScript Fundamentals and Key Concepts - Daily Challenge
