import { useEffect, useId, useRef, useState } from "react";
import { HashRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";
import { BookstoreProvider, useBookstore } from "./context.jsx";
import { submitOrder, loadReceipt } from "./api.js";
import * as U from "./ui.jsx";
import CartQuantity from "./CartQuantity.jsx";
const money = value =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(value / 100);
function BookCover({ book }) {
  return (
    <U.Cover $tone={book.tone}>
      <small>READROOM / PRACTICE PRESS</small>
      <strong>{book.title}</strong>
      <span>{book.author}</span>
    </U.Cover>
  );
}
function Home() {
  const { stores, t } = useBookstore();
  return (
    <>
      <U.Muted>READROOM / INDEPENDENT BOOKSHOPS</U.Muted>
      <h1>{t("home")}</h1>
      <p>{t("intro")}</p>
      <U.Grid>
        {stores.map(store => (
          <U.Card key={store.id}>
            <img
              src={store.image}
              alt={t("source")}
              loading="lazy"
              style={{ width: "100%", height: 190, objectFit: "cover" }}
            />
            <U.CardBody>
              <U.Muted>{store.city}</U.Muted>
              <h2>{store.name}</h2>
              <p>{store.address}</p>
              <U.Action to={"/stores/" + store.id}>{t("books")} →</U.Action>
            </U.CardBody>
          </U.Card>
        ))}
      </U.Grid>
    </>
  );
}
function Store() {
  const { storeId } = useParams(),
    { stores, books, add, t } = useBookstore();
  const store = stores.find(item => item.id === storeId);
  if (!store) return <NotFound />;
  return (
    <>
      <Link to="/">← {t("stores")}</Link>
      <h1 style={{ marginTop: 24 }}>{store.name}</h1>
      <U.Muted>
        {store.city} · {store.address}
      </U.Muted>
      <U.Grid>
        {books
          .filter(book => book.storeIds.includes(storeId))
          .map(book => (
            <U.Card key={book.id}>
              <U.CardBody>
                <BookCover book={book} />
                <h2 style={{ fontSize: "1.7rem", marginTop: 18 }}>{book.title}</h2>
                <U.Muted>{book.author}</U.Muted>
                <p>{money(book.priceCents)}</p>
                <U.Row>
                  <Link to={"/stores/" + storeId + "/books/" + book.id}>{t("details")}</Link>
                  <U.Button onClick={() => add(book.id, storeId)}>{t("add")}</U.Button>
                </U.Row>
              </U.CardBody>
            </U.Card>
          ))}
      </U.Grid>
    </>
  );
}
function Product() {
  const { storeId, bookId } = useParams(),
    { books, stores, add, t } = useBookstore();
  const book = books.find(item => item.id === bookId && item.storeIds.includes(storeId)),
    store = stores.find(item => item.id === storeId);
  if (!book || !store) return <NotFound />;
  return (
    <>
      <Link to={"/stores/" + storeId}>← {t("back")}</Link>
      <U.Detail>
        <section>
          <U.Muted>
            {store.name} / {book.genre}
          </U.Muted>
          <h1>{book.title}</h1>
          <p>
            {t("by")} {book.author}
          </p>
          <p>{book.description}</p>
          <dl>
            <dt>{t("publisher")}</dt>
            <dd>{book.publisher}</dd>
            <dt>{t("language")}</dt>
            <dd>{book.language}</dd>
            <dt>{t("pages")}</dt>
            <dd>{book.pages}</dd>
          </dl>
        </section>
        <U.Purchase>
          <BookCover book={book} />
          <h2 style={{ marginTop: 22 }}>{money(book.priceCents)}</h2>
          <U.Button onClick={() => add(book.id, storeId)}>{t("add")}</U.Button>
        </U.Purchase>
      </U.Detail>
    </>
  );
}
function Cart() {
  const { lines, change, remove, amountCents, t } = useBookstore();
  const [invalidRows, setInvalidRows] = useState(() => new Set());
  const quantityErrorId = useId();
  const markValid = (key, valid) =>
    setInvalidRows(current => {
      const next = new Set(current);
      if (valid) next.delete(key);
      else next.add(key);
      return next;
    });
  return (
    <>
      <h1>{t("cart")}</h1>
      {!lines.length ? (
        <>
          <p>{t("empty")}</p>
          <U.Action to="/">{t("browse")}</U.Action>
        </>
      ) : (
        <>
          {invalidRows.size > 0 && (
            <p id={quantityErrorId} role="alert">
              {t("quantityError")}
            </p>
          )}
          <U.TableWrap>
            <table>
              <thead>
                <tr>
                  <th>{t("name")}</th>
                  <th>{t("price")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("total")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map(line => (
                  <tr key={JSON.stringify([line.book.id, line.store.id])}>
                    <td>
                      <Link to={"/stores/" + line.store.id + "/books/" + line.book.id}>
                        {line.book.title}
                      </Link>
                      <br />
                      <small>{line.store.name}</small>
                    </td>
                    <td>{money(line.book.priceCents)}</td>
                    <td>
                      <CartQuantity
                        line={line}
                        change={change}
                        t={t}
                        errorId={quantityErrorId}
                        onValidity={valid =>
                          markValid(JSON.stringify([line.book.id, line.store.id]), valid)
                        }
                      />
                    </td>
                    <td>{money(line.quantity * line.book.priceCents)}</td>
                    <td>
                      <U.Button
                        $secondary
                        onClick={() => {
                          markValid(JSON.stringify([line.book.id, line.store.id]), true);
                          remove(line.book.id, line.store.id);
                        }}
                        aria-label={t("remove") + " " + line.book.title}
                      >
                        {t("remove")}
                      </U.Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </U.TableWrap>
          <h2>
            {t("total")}: {money(amountCents)}
          </h2>
          {invalidRows.size ? (
            <U.Button disabled>{t("checkout")}</U.Button>
          ) : (
            <U.Action to="/checkout">{t("checkout")}</U.Action>
          )}
        </>
      )}
    </>
  );
}
// Keep the same key across network retries, but use a new key when the cart changes.
function checkoutKey(lines) {
  const signature = JSON.stringify(
    lines.map(({ book, store, quantity }) => ({ bookId: book.id, storeId: store.id, quantity }))
  );
  try {
    const old = JSON.parse(sessionStorage.getItem("readroom-checkout") || "null");
    if (old?.signature === signature) return old.key;
    const key = crypto.randomUUID();
    sessionStorage.setItem("readroom-checkout", JSON.stringify({ signature, key }));
    return key;
  } catch {
    return crypto.randomUUID();
  }
}
function Checkout() {
  const { lines, amountCents, clear, t, localCatalog } = useBookstore(),
    navigate = useNavigate(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    sending = useRef(false);
  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (Object.values(data).some(value => !value.trim())) {
      setError(t("checkFields"));
      return;
    }
    if (!localCatalog) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await submitOrder(
        {
          ...data,
          books: lines.map(({ book, store, quantity }) => ({
            bookId: book.id,
            storeId: store.id,
            quantity,
          })),
          amount: amountCents / 100,
        },
        checkoutKey(lines)
      );
      clear();
      try {
        sessionStorage.removeItem("readroom-checkout");
      } catch {}
      navigate("/thanks/" + result.order.id);
    } catch {
      setError(t("orderError"));
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  return (
    <>
      <h1>{t("checkout")}</h1>
      {!lines.length ? (
        <>
          <p>{t("empty")}</p>
          <U.Action to="/">{t("browse")}</U.Action>
        </>
      ) : (
        <U.Form onSubmit={submit}>
          <p>{t("practice")}. Please use fictional customer details.</p>
          {["firstName", "lastName", "address", "phoneNumber"].map(field => (
            <label key={field}>
              {t(field)}
              <input
                name={field}
                required
                maxLength={200}
                autoComplete="off"
                type={field === "phoneNumber" ? "tel" : "text"}
              />
            </label>
          ))}
          <h2>
            {t("total")}: {money(amountCents)}
          </h2>
          {!localCatalog && <p role="alert">{t("needLocal")}</p>}
          {error && <p role="alert">{error}</p>}
          <U.Button disabled={busy || !localCatalog}>{busy ? t("sending") : t("buy")}</U.Button>
        </U.Form>
      )}
    </>
  );
}
function Thanks() {
  const { orderId } = useParams(),
    { t } = useBookstore(),
    [receipt, setReceipt] = useState(null),
    [status, setStatus] = useState("loading"),
    [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setStatus("loading");
    loadReceipt(orderId)
      .then(data => {
        if (active) {
          setReceipt(data.order);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [orderId, retry]);
  return (
    <>
      <h1>{t("thanks")}</h1>
      {status === "loading" ? (
        <p role="status">{t("loading")}</p>
      ) : status === "error" ? (
        <>
          <p role="alert">{t("notFound")}</p>
          <U.Button onClick={() => setRetry(n => n + 1)}>{t("retry")}</U.Button>
        </>
      ) : (
        <>
          <p>
            {receipt.firstName}, {t("order")}:
          </p>
          <p style={{ overflowWrap: "anywhere" }} data-testid="order-id">
            <strong>{receipt.id}</strong>
          </p>
          <h2>{money(receipt.amount * 100)}</h2>
          <p>{t("practice")}</p>
        </>
      )}
      <p>
        <U.Action to="/">{t("again")}</U.Action>
      </p>
    </>
  );
}
function NotFound() {
  const { t } = useBookstore();
  return (
    <>
      <h1>{t("notFound")}</h1>
      <U.Action to="/">{t("browse")}</U.Action>
    </>
  );
}
function Layout() {
  const { t, cart, language, setLanguage, status, retry, notice } = useBookstore();
  return (
    <>
      <U.GlobalStyle />
      <U.Header>
        <U.Brand to="/">
          readroom<span style={{ color: "#b5673c" }}>.</span>
        </U.Brand>
        <U.Nav aria-label="Main navigation">
          <Link to="/">{t("stores")}</Link>
          <Link to="/cart">
            {t("cart")} ({cart.reduce((n, line) => n + line.quantity, 0)})
          </Link>
          <label>
            <span className="sr-only">Language </span>
            <select
              aria-label="Language"
              value={language}
              onChange={event => setLanguage(event.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
        </U.Nav>
      </U.Header>
      <U.Strip>{t("practice")}</U.Strip>
      <U.Main>
        {notice && (
          <p role="status" aria-live="polite">
            {notice}
          </p>
        )}
        {status === "loading" ? (
          <p role="status">{t("loading")}</p>
        ) : status === "error" ? (
          <>
            <p role="alert">{t("catalogError")}</p>
            <U.Button onClick={retry}>{t("retry")}</U.Button>
          </>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stores/:storeId" element={<Store />} />
            <Route path="/stores/:storeId/books/:bookId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/thanks/:orderId" element={<Thanks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </U.Main>
      <U.Footer>
        readroom. / {new Date().getFullYear()} / Kevin Cusnir · Practice storefront
      </U.Footer>
    </>
  );
}
export default function App() {
  return (
    <HashRouter>
      <BookstoreProvider>
        <Layout />
      </BookstoreProvider>
    </HashRouter>
  );
}
