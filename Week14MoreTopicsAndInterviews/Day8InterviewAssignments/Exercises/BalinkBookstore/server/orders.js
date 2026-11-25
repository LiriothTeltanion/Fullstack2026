import { createHash, randomUUID } from "node:crypto";
import { books } from "./catalog.js";

export function validateOrder(body) {
  const fields = ["firstName", "lastName", "address", "phoneNumber"];
  if (
    !body ||
    fields.some(
      field => typeof body[field] !== "string" || !body[field].trim() || body[field].length > 200
    )
  ) {
    return { error: "Customer fields are required." };
  }
  if (!Array.isArray(body.books) || !body.books.length || body.books.length > 50)
    return { error: "Choose at least one book." };
  const lines = body.books.map(line => {
    if (!line || typeof line !== "object") return null;
    const book = books.find(item => item.id === line.bookId);
    if (
      !book ||
      !book.storeIds.includes(line.storeId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1 ||
      line.quantity > 99
    )
      return null;
    return {
      bookId: book.id,
      storeId: line.storeId,
      quantity: line.quantity,
      priceCents: book.priceCents,
    };
  });
  if (lines.some(line => !line)) return { error: "Invalid cart item." };
  // Recalculate from trusted fixture prices; never accept a browser-supplied total.
  const amountCents = lines.reduce((sum, line) => sum + line.quantity * line.priceCents, 0);
  if (body.amount !== amountCents / 100)
    return { error: "The cart total changed. Review your cart." };
  const customer = Object.fromEntries(fields.map(field => [field, body[field].trim()]));
  return { order: { ...customer, books: lines, amount: amountCents / 100 } };
}

export function createOrderStore() {
  const orders = new Map(),
    requests = new Map();
  return {
    create(body, key) {
      if (typeof key !== "string" || !/^[a-zA-Z0-9-]{8,100}$/.test(key))
        return { status: 400, error: "A valid idempotency key is required." };
      const validation = validateOrder(body);
      if (validation.error) return { status: 400, error: validation.error };
      const fingerprint = createHash("sha256")
        .update(JSON.stringify(validation.order))
        .digest("hex");
      // A retry after a lost response must resolve to the same receipt.
      const previous = requests.get(key);
      if (previous) {
        if (previous.fingerprint !== fingerprint)
          return {
            status: 409,
            error: "This checkout key was already used with a different order.",
          };
        return { status: 200, receipt: orders.get(previous.id) };
      }
      const receipt = {
        id: randomUUID(),
        firstName: validation.order.firstName,
        amount: validation.order.amount,
        createdAt: new Date().toISOString(),
      };
      orders.set(receipt.id, receipt);
      requests.set(key, { id: receipt.id, fingerprint });
      return { status: 201, receipt };
    },
    get(id) {
      return orders.get(id);
    },
  };
}
