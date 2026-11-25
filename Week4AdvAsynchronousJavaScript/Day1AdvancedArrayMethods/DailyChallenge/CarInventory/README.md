# 💪 Daily Challenge - Car Inventory

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/car-inventory-0e0706421a.svg" width="100%" alt="Progress card for Car Inventory">

</div>

Five cars in an array and two buttons. One finds the first Honda, the other draws the cars as cards sorted by year.

## ▶️ How to run

Open `index.html` in a browser, or run `npm run dev` from the repository root and go to `http://localhost:8000/Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods/DailyChallenge/CarInventory/`.

I call `getCarHonda()` once when the script loads, so this line is already there before any click:

```
✅ This is a Honda Accord from 1983.
```

## 🎯 The challenge

| Function | What it does |
|---|---|
| `getCarHonda(carInventory)` | `find` gets the first car with `car_make === "Honda"` and returns a sentence about it, or `🙈 No Honda found in the inventory.` |
| `sortCarInventoryByYear(carInventory)` | Returns a new array sorted by `car_year`, oldest first. The original `inventory` stays in its order |

**Sort Inventory** draws one card per car. Both functions are also on `window`, so I can try them from the DevTools console. There are two Accords (1983 and 1995); `find` stops at the first one in the array.

## 🧠 What I learned

- `find` gives back the first matching element, or `undefined` when nothing matches
- `sort` mutates the array, so I spread it into a copy first (`[...carInventory]`)
- Subtracting the years in the compare function (`a.car_year - b.car_year`) gives an ascending numeric sort

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 4 Day 1 - Advanced Array Methods - Daily Challenge
