import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";

export const CATEGORIES = ["Food", "Transport", "Bills", "Fun", "Other"];

const expensesSlice = createSlice({
  name: "expenses",
  initialState: {
    items: [
      { id: "e1", description: "Groceries", amount: 186.4, category: "Food" },
      { id: "e2", description: "Rav-Kav top-up", amount: 50, category: "Transport" },
    ],
    filter: "All",
  },
  reducers: {
    expenseAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ description, amount, category }) {
        return { payload: { id: nanoid(), description, amount, category } };
      },
    },
    expenseUpdated(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    expenseDeleted(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    filterChanged(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { expenseAdded, expenseUpdated, expenseDeleted, filterChanged } =
  expensesSlice.actions;
export default expensesSlice.reducer;

const selectItems = state => state.expenses.items;
export const selectFilter = state => state.expenses.filter;

export const selectVisibleExpenses = createSelector([selectItems, selectFilter], (items, filter) =>
  filter === "All" ? items : items.filter(item => item.category === filter)
);

export const selectTotal = createSelector([selectVisibleExpenses], items =>
  items.reduce((sum, item) => sum + item.amount, 0)
);

export const selectTotalsByCategory = createSelector([selectItems], items =>
  CATEGORIES.map(category => ({
    category,
    total: items
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0),
  })).filter(row => row.total > 0)
);
