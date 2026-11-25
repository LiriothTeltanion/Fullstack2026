# 🥇 Exercises XP Gold

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xp-gold-56309ae690.svg" width="100%" alt="Progress card for Exercises XP Gold">

</div>

Six Knex queries on a tiny store (products, customers and orders). The script can run them on PostgreSQL or just print the SQL that Knex builds, which helped me compare Knex code with the SQL I wrote in Week 6.

## ▶️ How to run

```bash
npm install
npm run sql            # prints the SQL, no database needed
```

To run the queries for real, load `db/schema.sql` into a database, copy `.env.example` to `.env` and run `npm start`.

Part of the `npm run sql` output:

```
2. Tech and home products
select "name", "category" from "products" where "category" in ('tech', 'home') order by "name" asc

4. Spending per customer
select "c"."name", sum(p.price * o.quantity) as "total" from "orders" as "o" inner join "customers" as "c" on "c"."id" = "o"."customer_id" inner join "products" as "p" on "p"."id" = "o"."product_id" group by "c"."name" order by "total" desc

5. Search "co"
select "name" from "products" where "name" ilike '%co%'
```

## 🎯 The challenge

| Function | Query |
|---|---|
| `cheapProducts()` | Products under 60, cheapest first (`where`, `orderBy`) |
| `productsIn(categories)` | Products whose category is in a list (`whereIn`) |
| `orderDetails()` | Every order with customer and product names (two `join`s with aliases) |
| `spendingPerCustomer()` | Total spent per customer (`sum` with `db.raw`, `groupBy`) |
| `searchProducts(text)` | Case-insensitive search (`whereILike`) |
| `placeOrder(customerId, productId, quantity)` | A transaction that checks stock, runs `decrement("stock")` and inserts the order |

`placeOrder` only runs in the real mode, because it writes to the database.

## 🧠 What I learned

- `query.toString()` shows the final SQL, which is the fastest way to debug a Knex chain
- `db.raw()` is the way out when a column expression like `p.price * o.quantity` is not a plain column name
- Inside `db.transaction(async (trx) => ...)` every query must use `trx`, and throwing an error rolls everything back
- Values are passed as bindings, so the search text never gets glued into the SQL by hand

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 2 - SQL Query Builder - Exercises XP Gold
