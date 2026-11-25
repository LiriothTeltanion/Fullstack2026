# 🥉 Exercises XP

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-0ff82fe9a6.svg" width="100%" alt="Progress card for Exercises XP">

</div>

Seven exercises, half about functions and half about changing the DOM. Like on Day 1, one page runs them: each exercise has a card for its output, and the same text goes to the console.

## ▶️ How to run

Open `index.html` in a browser (or use `npm run dev` from the repo root). Click **Run 1** … **Run 7**, **Run ALL** or **Clear**. Exercise 4 asks its questions with `prompt()`.

```
Numbers:
0 23 46 69 ... 483
Sum: 5313
```

## 🎯 The challenge

1. **Divisible by 23**: `displayNumbersDivisible(divisor = 23)` collects every number from 0 to 500 that divides by 23, plus their sum (5313).
2. **Shopping List**: `myBill()` adds up the price of each item that is in stock and takes 1 off its stock. Apples are at 0, so the total is `$5.5`.
3. **What's in my wallet?**: `changeEnough(price, [quarters, dimes, nickels, pennies])` gives `true`, `false`, `true` for the three samples.
4. **Vacations Costs**: `hotelCost`, `planeRideCost` (London 183, Paris 220, anywhere else 300) and `rentalCarCost` (40 a day, 5% off after 10 days). `totalVacationCost()` asks for every value and keeps asking until the answer is valid.
5. **Users**: rename `Pete` to `Richard`, remove `Sarah`, rename the first item of each list to `Kevin`, hide `Dan` (he is in the second list), add classes and styles, then alert `Hello Kevin and Kevin`.
6. **Change the navbar**: change the id to `socialNetworkNavigation`, add a `Logout` item and print the text of the first and last links.
7. **My Book List**: render two books with a 100px cover. A book I already read gets red text.

## 🧠 What I learned

- A default parameter like `divisor = 23` lets me call the function with or without a value
- Splitting the trip into `hotelCost()`, `planeRideCost()` and `rentalCarCost()` made the total one easy line
- Most of exercise 5 was just `querySelectorAll`, `classList` and `style`
- Checking `item in stock && stock[item] > 0` is how the bill skips the apples

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 3 Day 2 - Functions and DOM Introduction - Exercises XP
