# 💪 Daily Challenge - Type Guard with Union Types

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-dd0d57f83c.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

`handleData()` takes a mixed list of users, products and orders, uses type guards to work out what each item is and writes one line about it. Unknown items get a line too, instead of an error.

## ▶️ How to run

From this folder:

```bash
npx tsc TypeGuardUnion.ts --module commonjs --types node --outDir ~/tmp-ts
node ~/tmp-ts/TypeGuardUnion.js
```

The demo is wrapped in `if (require.main === module)`, so it needs CommonJS. Running the `.ts` file straight with Node fails with `require is not defined in ES module scope`.

```
Hello Kevin, age 30.
Product #101 costs $49.90.
Order ORD-2025-0001: amount $120.50.
Unknown item at index 3.
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `isUser(x)` / `isProduct(x)` / `isOrder(x)` | Type predicates: check the `type` field and that the other fields have the right `typeof` |
| `handleData(items)` | Loops with an index and pushes a greeting, a price line or an order line |

All three types have a `type` field (`"user"`, `"product"`, `"order"`), which makes `Mixed = User | Product | Order` a discriminated union. The fourth demo item is `{ type: "mystery", foo: "bar" }`, and that is the one reported at index 3.

## 🧠 What I learned

- When a function returns `x is User`, TypeScript knows `item.name` exists inside that `if`
- Typing the input as `Array<Mixed | unknown>` is honest about data that may not match
- I used a plain `for` loop because I wanted the index in the "unknown" message

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 4 - Advanced TypeScript Concepts and Applications - Daily Challenge
