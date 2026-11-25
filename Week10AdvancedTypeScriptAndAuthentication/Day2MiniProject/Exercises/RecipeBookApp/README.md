# 🎮 Mini Project - Recipe Book App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/recipe-book-app-f6132aba66.svg" width="100%" alt="Progress card for Recipe Book App">

</div>

A recipe book in React and TypeScript. I can write a recipe with its ingredients (one per line), search by title or ingredient, star favorites and open a card to read the steps. The book is kept in `localStorage`.

## ▶️ How to run

```bash
npm install
npm run dev
```

## 🎯 The challenge

| Piece | What it does |
|---|---|
| `models/recipe.ts` | `Recipe` interface, `RecipeDraft = Omit<Recipe, "id" \| "favorite">`, `createRecipe`, `parseIngredients`, `matchesSearch` |
| `models/storage.ts` | `loadRecipes` (with a starter shakshuka) and `saveRecipes` |
| `hooks/useRecipes.ts` | The list in state plus `addRecipe`, `toggleFavorite` and `deleteRecipe`; saves after every change |
| `RecipeForm` | Validates title, ingredients and instructions, then calls `onSave(draft)` |
| `RecipeCard` | Star button, Show/Hide for the details, Delete |
| `App` | Search box, "Favorites only" checkbox and the visible count |

## 🧠 What I learned

- `RecipeDraft` comes from `Omit`, so the form type can't drift away from the real `Recipe`
- Moving the list logic into `useRecipes` left `App` with only layout and filters
- `useState<Recipe[]>(loadRecipes)` passes the function itself, so storage is read once and not on every render
- `crypto.randomUUID()` gives ids that don't clash, even for two recipes saved in the same millisecond

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 2 - Mini-project - Mini Project
