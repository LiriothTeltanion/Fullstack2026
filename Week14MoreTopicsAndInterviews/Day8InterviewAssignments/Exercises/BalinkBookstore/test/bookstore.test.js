import test from "node:test";
import assert from "node:assert/strict";
import { createFixtureServer } from "../server/index.js";
import { validateOrder } from "../server/orders.js";
import { cleanCart, cartLines, totalCents } from "../src/cart.js";
import { books, stores } from "../server/catalog.js";
const valid = {
  firstName: "Practice",
  lastName: "Reader",
  address: "12 Example Street",
  phoneNumber: "0000000000",
  books: [{ bookId: "night-garden", storeId: "paper-lantern", quantity: 2 }],
  amount: 36,
};
test("cart merges duplicates, ignores malformed storage and calculates integer cents", () => {
  assert.deepEqual(cleanCart(null), []);
  assert.deepEqual(cleanCart([null, { bookId: "x", storeId: "s", quantity: 1.5 }]), []);
  const cart = cleanCart([...valid.books, ...valid.books]);
  assert.equal(cart[0].quantity, 4);
  assert.equal(totalCents(cartLines(cart, books, stores)), 7200);
  assert.equal(
    cartLines([{ bookId: "unknown", storeId: "paper-lantern", quantity: 1 }], books, stores).length,
    0
  );
});
test("server validates customer, quantities, store membership and authoritative total", () => {
  for (const body of [
    null,
    { ...valid, firstName: " " },
    { ...valid, books: [null] },
    { ...valid, books: [{ ...valid.books[0], quantity: -1 }] },
    { ...valid, books: [{ ...valid.books[0], quantity: 1.1 }] },
    { ...valid, books: [{ ...valid.books[0], storeId: "unknown" }] },
    { ...valid, amount: 0.01 },
  ])
    assert.ok(validateOrder(body).error);
  assert.equal(validateOrder(valid).order.amount, 36);
});
test("HTTP catalog, order UUID, reload, idempotent retry, conflict and negative paths", async () => {
  const server = createFixtureServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const post = (body, key = "practice-order-123") =>
    fetch(base + "/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": key },
      body: JSON.stringify(body),
    });
  try {
    assert.equal((await (await fetch(base + "/api/stores")).json()).stores.length, 3);
    assert.equal((await (await fetch(base + "/api/books")).json()).books.length, 6);
    assert.equal((await fetch(base + "/api/books/unknown")).status, 404);
    assert.equal((await fetch(base + "/api/books/%XX")).status, 404);
    assert.equal((await post(valid, "bad")).status, 400);
    assert.equal((await post({ ...valid, amount: 1 })).status, 400);
    const created = await post(valid);
    assert.equal(created.status, 201);
    const { order } = await created.json();
    assert.match(order.id, /^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/);
    assert.deepEqual(Object.keys(order).sort(), ["amount", "createdAt", "firstName", "id"]);
    const repeated = await post(valid);
    assert.equal(repeated.status, 200);
    assert.equal((await repeated.json()).order.id, order.id);
    assert.equal((await post({ ...valid, firstName: "Changed" })).status, 409);
    assert.equal((await (await fetch(base + "/api/orders/" + order.id)).json()).order.id, order.id);
    assert.equal((await fetch(base + "/api/orders/missing")).status, 404);
    assert.equal(
      (
        await fetch(base + "/api/orders", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: "broken",
        })
      ).status,
      400
    );
    assert.equal(
      (await post({ ...valid, address: "x".repeat(40000) }, "practice-order-large")).status,
      413
    );
    assert.equal((await fetch(base + "/missing")).status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
