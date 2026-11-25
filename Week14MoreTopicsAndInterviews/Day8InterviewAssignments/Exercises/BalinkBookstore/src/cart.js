export function cleanCart(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      line =>
        line &&
        typeof line.bookId === "string" &&
        typeof line.storeId === "string" &&
        Number.isInteger(line.quantity) &&
        line.quantity >= 1 &&
        line.quantity <= 99
    )
    .reduce((result, line) => {
      const old = result.find(item => item.bookId === line.bookId && item.storeId === line.storeId);
      if (old) old.quantity = Math.min(99, old.quantity + line.quantity);
      else result.push({ bookId: line.bookId, storeId: line.storeId, quantity: line.quantity });
      return result;
    }, []);
}
export function cartLines(cart, books, stores) {
  return cart.flatMap(line => {
    const book = books.find(
        item => item.id === line.bookId && item.storeIds.includes(line.storeId)
      ),
      store = stores.find(item => item.id === line.storeId);
    return book && store ? [{ ...line, book, store }] : [];
  });
}
export const totalCents = lines =>
  lines.reduce((sum, line) => sum + line.book.priceCents * line.quantity, 0);
