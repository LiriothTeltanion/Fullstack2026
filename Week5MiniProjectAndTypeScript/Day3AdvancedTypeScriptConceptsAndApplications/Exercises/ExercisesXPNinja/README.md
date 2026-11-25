# 🥷 Exercises XP Ninja

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-ninja-94f2036b0b.svg" width="100%" alt="Progress card for Exercises XP Ninja">

</div>

[ExercisesXPNinja.ts](ExercisesXPNinja.ts) builds a generic repository, plays with `keyof` and mapped types, and adds an event emitter where every event has its own payload type.

## ▶️ How to run

```bash
node ExercisesXPNinja.ts
npx tsc --strict --noEmit ExercisesXPNinja.ts
```

```
1. [
  { id: 1, title: 'Dune', author: 'Frank Herbert', available: true },
  { id: 2, title: 'Neuromancer', author: 'William Gibson', available: false }
]
2. Dune true
3. Hyperion | { id: 10, title: 'Untitled', author: null, available: null }
4. kevin logged in
4. kevin left after 42 min
5. admin  -> read, write, delete
5. editor -> read, write
5. viewer -> read
```

## 🎯 The challenge

| Exercise | What it does |
|---|---|
| 1. `Repository<T extends Entity>` | `add`, `findById`, `update`, `remove` and `all` over a `Map`; `update()` takes `Partial<Omit<T, "id">>` |
| 2. `getField<T, K extends keyof T>()` | Returns `T[K]`, so asking for `"available"` gives a `boolean` |
| 3. `MyReadonly<T>`, `Nullable<T>` | My own mapped types, written like the built-in ones |
| 4. `TypedEmitter<AppEvents>` | `on()` and `emit()` check that the payload matches the event name |
| 5. `Record<Role, string[]>` | A permissions table that must have all three roles |

## 🧠 What I learned

- `T extends Entity` is what allows the repository to read `item.id` on any type
- `Omit<T, "id">` inside `Partial` stops an update from changing the id
- In the emitter, a wrong payload for `"login"` is a compile error, not a bug I find later
- `Object.keys()` returns `string[]`, so I had to say `as Role[]` to index the record

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 3 - Advanced TypeScript Concepts and Applications - Exercises XP Ninja
