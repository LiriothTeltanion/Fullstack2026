import { createContext, useContext, useEffect, useRef, useState } from "react";
import { loadCatalog, localCatalog } from "./api.js";
import { cleanCart, cartLines, totalCents, changeQuantity } from "./cart.js";
import { text } from "./i18n.js";
const Context = createContext(null);
function restoreCart() {
  try {
    return cleanCart(JSON.parse(localStorage.getItem("readroom-cart") || "[]"));
  } catch {
    return [];
  }
}
export function BookstoreProvider({ children }) {
  const [catalog, setCatalog] = useState({ stores: [], books: [] }),
    [status, setStatus] = useState("loading"),
    [reload, setReload] = useState(0);
  const [cart, setCart] = useState(restoreCart),
    [language, setLanguage] = useState("en"),
    [notice, setNotice] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);
  const previousCart = useRef(cart);
  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadCatalog()
      .then(data => {
        if (active) {
          setCatalog(data);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [reload]);
  useEffect(() => {
    if (cart === previousCart.current) return;
    previousCart.current = cart;
    try {
      localStorage.setItem("readroom-cart", JSON.stringify(cart));
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [cart]);
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const lines = cartLines(cart, catalog.books, catalog.stores),
    amountCents = totalCents(lines);
  const add = (bookId, storeId) => {
    setCart(current => cleanCart([...current, { bookId, storeId, quantity: 1 }]));
    setNotice(text[language].saved);
  };
  const change = (bookId, storeId, quantity) =>
    setCart(current => changeQuantity(current, bookId, storeId, quantity));
  const remove = (bookId, storeId) =>
    setCart(current => current.filter(line => line.bookId !== bookId || line.storeId !== storeId));
  return (
    <Context.Provider
      value={{
        ...catalog,
        status,
        retry: () => setReload(n => n + 1),
        cart,
        lines,
        amountCents,
        add,
        change,
        remove,
        clear: () => setCart([]),
        language,
        setLanguage,
        t: key => text[language][key] ?? key,
        notice: saveFailed ? text[language].saveFailed : notice,
        localCatalog,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useBookstore = () => useContext(Context);
