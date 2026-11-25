const catalogBase = (import.meta.env.VITE_CATALOG_BASE || "/api").replace(/\/$/, "");
export const localCatalog = catalogBase === "/api";
async function json(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}
export async function loadCatalog() {
  const [storesResult, booksResult] = await Promise.all([
    json(catalogBase + "/stores"),
    json(catalogBase + "/books"),
  ]);
  if (!Array.isArray(storesResult.stores) || !Array.isArray(booksResult.books))
    throw new Error("Unexpected catalog shape");
  const books = booksResult.books;
  if (
    !books.every(
      book =>
        typeof book.id === "string" &&
        typeof book.title === "string" &&
        Number.isInteger(book.priceCents) &&
        Array.isArray(book.storeIds)
    )
  )
    throw new Error("Unverified catalog schema");
  return { stores: storesResult.stores, books };
}
export const submitOrder = (body, key) =>
  json("/api/orders", {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": key },
    body: JSON.stringify(body),
  });
export const loadReceipt = id => json("/api/orders/" + encodeURIComponent(id));
