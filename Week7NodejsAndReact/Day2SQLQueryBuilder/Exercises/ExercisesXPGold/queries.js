// Exercises XP Gold: six Knex queries on the store tables.
// node queries.js        -> runs them on PostgreSQL and prints the rows
// node queries.js --dry  -> only prints the SQL that Knex builds (no database needed)
import db from "./db/db.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 1. Products under 60, cheapest first
export const cheapProducts = () =>
  db("products").select("name", "price").where("price", "<", 60).orderBy("price");

// 2. Products from a list of categories
export const productsIn = categories =>
  db("products").select("name", "category").whereIn("category", categories).orderBy("name");

// 3. Every order with the customer and product names (two joins)
export const orderDetails = () =>
  db("orders as o")
    .join("customers as c", "c.id", "o.customer_id")
    .join("products as p", "p.id", "o.product_id")
    .select("o.id", "c.name as customer", "p.name as product", "o.quantity")
    .orderBy("o.id");

// 4. Keep distinct customer identities, including customers without any orders.
export const spendingPerCustomer = () =>
  db("customers as c")
    .leftJoin("orders as o", "c.id", "o.customer_id")
    .leftJoin("products as p", "p.id", "o.product_id")
    .select("c.id", "c.name")
    .select(db.raw("COALESCE(SUM(?? * ??), 0) AS ??", ["p.price", "o.quantity", "total"]))
    .groupBy("c.id", "c.name")
    .orderBy("total", "desc")
    .orderBy("c.id");

// 5. Case-insensitive search by name
export const searchProducts = text => db("products").select("name").whereILike("name", `%${text}%`);

// 6. Place an order: insert it and lower the stock, all or nothing.
export async function placeOrder(customerId, productId, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    throw new RangeError("Quantity must be a positive safe integer");
  }

  return db.transaction(async trx => {
    // Reserve stock only when enough is available, using one conditional update.
    const updated = await trx("products")
      .where({ id: productId })
      .where("stock", ">=", quantity)
      .decrement("stock", quantity)
      .returning("id");
    if (updated.length === 0) {
      throw new Error("Not enough stock");
    }
    const [order] = await trx("orders")
      .insert({ customer_id: customerId, product_id: productId, quantity })
      .returning("*");
    return order;
  });
}

async function main() {
  const exercises = [
    ["1. Products under 60", cheapProducts()],
    ["2. Tech and home products", productsIn(["tech", "home"])],
    ["3. Order details", orderDetails()],
    ["4. Spending per customer", spendingPerCustomer()],
    ['5. Search "co"', searchProducts("co")],
  ];
  const dryRun = process.argv.includes("--dry");
  for (const [title, query] of exercises) {
    console.log(`\n${title}`);
    if (dryRun) {
      console.log(query.toString());
    } else {
      console.table(await query);
    }
  }

  if (!dryRun) {
    console.log("\n6. Place an order (transaction)");
    console.log(await placeOrder(2, 5, 1));
    const lamp = await db("products").select("name", "stock").where({ id: 5 }).first();
    console.log(lamp);
  }
  await db.destroy();
}

// Importing these query helpers leaves execution and connection cleanup to the caller.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(async err => {
    console.error(err.message);
    await db.destroy();
    process.exitCode = 1;
  });
}
