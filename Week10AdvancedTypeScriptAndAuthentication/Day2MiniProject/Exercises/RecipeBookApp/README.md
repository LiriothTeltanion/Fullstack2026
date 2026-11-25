# 🎮 Mini Project - Recipe Book App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/recipe-book-app-f6132aba66.svg" width="100%" alt="Progress card for Recipe Book App">

</div>

A recipe book built with TypeScript classes and DOM rendering. I can write a recipe with its ingredients (one per line), search by title or ingredient, star favorites and open a card to read the steps. The book is kept in `localStorage`.

## ▶️ How to run

```bash
npm install
npm run dev
```

## 🎯 The challenge

The normal entry point is [src/main.ts](src/main.ts), which connects three classes.

| Piece                                                | What it does                                                                                                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [RecipeItem.ts](src/model/RecipeItem.ts)             | Interface and class for one recipe, including its isFavorite state                                                                                   |
| [RecipeCollection.ts](src/model/RecipeCollection.ts) | Loads, adds, deletes, favorites and clears recipes; saves under the existing recipe-book storage key, accepting both favorite and isFavorite records |
| [RecipeTemplate.ts](src/templates/RecipeTemplate.ts) | Builds accessible DOM cards with textContent and ingredients/instructions disclosures                                                                |
| [main.ts](src/main.ts)                               | Form validation, search, favorites filter, count and event wiring                                                                                    |

The saved data from the earlier React implementation is accepted. Clearing the entire book asks for confirmation. If storage is unavailable, an on-page message explains that changes last for the current session.

## Earlier React implementation

The React components below remain available as a comparison with the class-based entry point. The default index.html loads main.ts.

| Piece                 | What it does                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `models/recipe.ts`    | `Recipe` interface, `RecipeDraft = Omit<Recipe, "id" \| "favorite">`, `createRecipe`, `parseIngredients`, `matchesSearch` |
| `models/storage.ts`   | `loadRecipes` (with a starter shakshuka) and `saveRecipes`                                                                |
| `hooks/useRecipes.ts` | The list in state plus `addRecipe`, `toggleFavorite` and `deleteRecipe`; saves after every change                         |
| `RecipeForm`          | Validates title, ingredients and instructions, then calls `onSave(draft)`                                                 |
| `RecipeCard`          | Star button, Show/Hide for the details, Delete                                                                            |
| `App`                 | Search box, "Favorites only" checkbox and the visible count                                                               |

## 🧠 What I learned

- Restoring JSON requires constructing RecipeItem instances again, because JSON does not preserve class methods
- A collection separates persistence from the DOM template, and both use the same Recipe interface
- textContent safely renders recipe text, including text that looks like HTML

### Earlier React notes

- `RecipeDraft` comes from `Omit`, so the form type can't drift away from the real `Recipe`
- Moving the list logic into `useRecipes` left `App` with only layout and filters
- `useState<Recipe[]>(loadRecipes)` passes the function itself, so storage is read once and not on every render
- `crypto.randomUUID()` gives ids that don't clash, even for two recipes saved in the same millisecond

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 10 Day 2 - Mini-project - Mini Project
