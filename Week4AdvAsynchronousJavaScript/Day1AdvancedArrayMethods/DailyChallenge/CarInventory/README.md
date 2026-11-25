# 🚗 Daily Challenge — Car Inventory

Learn & practice advanced array methods in JavaScript with a tiny, testable project.

## 🧠 What you’ll use
- `Array.prototype.find` — to get the **first** Honda
- `Array.prototype.sort` — to sort by `car_year` (ascending)
- Non‑mutating patterns using the spread operator

## 📦 Project Structure
```
car-inventory-emoji/
├─ index.html
├─ js/
│  └─ app.js
└─ README.md
```

## ▶️ Run it
1. Unzip the project.
2. Open `index.html` in your browser.
3. Click **Find Honda** and **Sort Inventory** to see results on the page.  
   You’ll also find the functions on `window` for quick testing in DevTools:
   ```js
   getCarHonda(inventory);          // "✅ This is a Honda Accord from 1983."
   sortCarInventoryByYear(inventory) // returns new array sorted by year
   ```

## 🔧 Implementation

### Part I — `getCarHonda(carInventory)`
Returns a string for the first Honda, or a helpful message if none exists.
```js
function getCarHonda(carInventory) {
  const honda = carInventory.find(car => car.car_make === "Honda");
  if (!honda) return "🙈 No Honda found in the inventory.";
  return `✅ This is a ${honda.car_make} ${honda.car_model} from ${honda.car_year}.`;
}
```

### Part II — `sortCarInventoryByYear(carInventory)`
Returns a **new** array sorted ascending by `car_year`.
```js
function sortCarInventoryByYear(carInventory) {
  return [...carInventory].sort((a, b) => a.car_year - b.car_year);
}
```

## ✨ Notes
- Sorting with a **copy** (`[...carInventory]`) avoids mutating the original array.
- The page includes a small UI with emojis so you can visually verify behavior.  
- No build tools required — just open the file. Happy hacking! 🚀
