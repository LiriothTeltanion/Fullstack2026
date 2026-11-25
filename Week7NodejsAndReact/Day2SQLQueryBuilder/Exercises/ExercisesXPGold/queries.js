// Exercises XP Gold: six Knex queries on the store tables.
// node queries.js        -> runs them on PostgreSQL and prints the rows
// node queries.js --dry  -> only prints the SQL that Knex builds (no database needed)
import db from "./db/db.js";

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

// 4. How much each customer spent (groupBy + sum)
export const spendingPerCustomer = () =>
  db("orders as o")
    .join("customers as c", "c.id", "o.customer_id")
    .join("products as p", "p.id", "o.product_id")
    .select("c.name")
    .sum({ total: db.raw("p.price * o.quantity") })
    .groupBy("c.name")
    .orderBy("total", "desc");

// 5. Case-insensitive search by name
export const searchProducts = text => db("products").select("name").whereILike("name", `%${text}%`);

// 6. Place an order: insert it and lower the stock, all or nothing.
export function placeOrder(customerId, productId, quantity) {
  return db.transaction(async trx => {
    const product = await trx("products").where({ id: productId }).first();
    if (!product || product.stock < quantity) {
      throw new Error("Not enough stock");
    }
    await trx("products").where({ id: productId }).decrement("stock", quantity);
    const [order] = await trx("orders")
      .insert({ customer_id: customerId, product_id: productId, quantity })
      .returning("*");
    return order;
  });
}

const exercises = [
  ["1. Products under 60", cheapProducts()],
  ["2. Tech and home products", productsIn(["tech", "home"])],
  ["3. Order details", orderDetails()],
  ["4. Spending per customer", spendingPerCustomer()],
  ['5. Search "co"', searchProducts("co")],
];

async function main() {
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

main().catch(async err => {
  console.error(err.message);
  await db.destroy();
  process.exitCode = 1;
});
