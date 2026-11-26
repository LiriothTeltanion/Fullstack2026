import { useEffect, useState } from "react";
import { parseQuantity } from "./cart.js";

export default function CartQuantity({ line, change, onValidity, errorId, t }) {
  const [draft, setDraft] = useState(String(line.quantity));
  const invalid = parseQuantity(draft) === null;
  useEffect(() => setDraft(String(line.quantity)), [line.quantity]);

  return (
    <>
      <input
        aria-label={t("quantity") + " " + line.book.title}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        type="number"
        min="1"
        max="99"
        step="1"
        value={draft}
        onChange={event => {
          const value = event.target.value;
          setDraft(value);
          const quantity = parseQuantity(value);
          onValidity(quantity !== null);
          if (quantity !== null) change(line.book.id, line.store.id, quantity);
        }}
      />
    </>
  );
}
