# Union Type Validator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/union-type-validator-805b55c1bb.svg" width="100%" alt="Progress card for Union Type Validator">

</div>

For this TypeScript daily challenge I wrote `validateUnionType(value, allowedTypes)`. It takes a value and an array of type names as strings, and returns `true` if the value's `typeof` is one of them, `false` otherwise.

## Files

```
UnionTypeValidator/
├── src/index.ts      # Function, 10 test cases and a form example
├── package.json
└── tsconfig.json     # Compiles to dist/ (git-ignored)
```

## How to run

You need Node.js and npm. From this folder:

```bash
npm install     # typescript and @types/node
npm start       # compile with tsc, then run dist/index.js
```

`npm run build` only compiles, and `npm run dev` recompiles on every change. `npm test` does the same as `npm start`.

## The function

```typescript
function validateUnionType(value: any, allowedTypes: string[]): boolean {
  const valueType = typeof value;

  for (const allowedType of allowedTypes) {
    if (valueType === allowedType) {
      return true;
    }
  }

  return false;
}
```

I also wrote a shorter version, `validateUnionTypeAlt`, that just returns `allowedTypes.includes(typeof value)`.

```typescript
const userId: string | number = "USR123";
validateUnionType(userId, ["string", "number"]); // true

const isActive: boolean = true;
validateUnionType(isActive, ["string", "number"]); // false
```

## Test cases

`src/index.ts` runs 10 cases and prints each value, its type, the allowed types and the result: string, number, boolean (expected fail), object, array, function, undefined, a `string | number` variable, symbol (expected fail) and bigint. At the end there's a small form validation example that checks a list of fields like `username`, `age` and `isSubscribed` and prints valid or invalid for each one.

## What I learned

- `typeof` checks types at runtime, while union types like `string | number` only exist at compile time.
- `typeof []` and `typeof null` both return `"object"`, so `typeof` can't tell arrays, null and objects apart. For that you need `Array.isArray()`, `instanceof` or custom type guards.
- Typing function parameters and return values, and looping with `for...of`.

Useful docs: [TypeScript union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html) and [MDN typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof).
