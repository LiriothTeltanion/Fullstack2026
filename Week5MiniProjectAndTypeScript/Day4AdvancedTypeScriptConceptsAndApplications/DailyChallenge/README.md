# 💪 Daily Challenge - Type Guard with Union Types

<div align="center">

<img src="../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../assets/readme/progress/daily-challenge-dd0d57f83c.svg" width="100%" alt="Progress card for Daily Challenge">

</div>

`handleData()` gets a mixed list of users, products and orders, uses type guards to find out what each item is and returns one message per item. Unknown items get a message instead of an error.

## ▶️ How to run

From this folder:

```bash
npx tsc TypeGuardUnion.ts --module commonjs --types node --outDir ~/tmp-ts
node ~/tmp-ts/TypeGuardUnion.js
```

The demo uses `require.main === module`, so it needs CommonJS: running the `.ts` file straight with Node stops with `require is not defined in ES module scope`.

```
Hello Kevin, age 30.
Product #101 costs $49.90.
Order ORD-2025-0001: amount $120.50.
Unknown item at index 3.
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `isUser(x)` / `isProduct(x)` / `isOrder(x)` | Type predicates that check the `type` field and the other fields' types |
| `handleData(items)` | Loops over the list and builds a greeting, a price line or an order line |

The three types share a `type` field (`"user"`, `"product"`, `"order"`), so `Mixed = User | Product | Order` is a discriminated union.

## 🧠 What I learned

- A function that returns `x is User` narrows the type inside an `if`
- A shared literal field makes union types easy to tell apart
- Returning a message for unknown data is gentler than throwing

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 4 - Advanced TypeScript Concepts and Applications - Daily Challenge
