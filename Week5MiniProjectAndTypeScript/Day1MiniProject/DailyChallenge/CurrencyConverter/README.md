# 💪 Daily Challenge - Currency Converter

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/currency-converter-e742522f43.svg" width="100%" alt="Progress card for Currency Converter">

</div>

Two dropdowns, an amount and a **Convert** button. The currency list and the rates both come from [ExchangeRate-API](https://www.exchangerate-api.com/), and the ⇅ button swaps the two currencies.

## ▶️ How to run

1. Make a free ExchangeRate-API account and copy the key.
2. Copy the template and replace `"replace-me"` with the key. Git ignores `config.js`, so the key stays on the local machine.

```bash
cp config.example.js config.js
```

3. Open `index.html` in a browser, or run `npm run dev` from the repository root and go to `http://localhost:8000/Week5MiniProjectAndTypeScript/Day1MiniProject/DailyChallenge/CurrencyConverter/`.

It starts on 1 USD to ILS. Choose the currencies, type an amount, then click **Convert** or press Enter.

## 🎯 The challenge

| Function | What it does |
|---|---|
| `loadSupportedCurrencies()` | On load, calls `GET /v6/{key}/codes`; `populateCurrencySelects()` then fills both dropdowns |
| `convertCurrency()` | Needs two currencies and an amount above 0, then calls `GET /v6/{key}/pair/{from}/{to}/{amount}` |
| `displayResult()` | Prints `conversion_result` with 2 decimals and the rate with 4 (`1 USD = … ILS`) |
| `switchCurrencies()` | Swaps "From" and "To" and converts again if the amount is positive |

A spinner shows while a request runs. A bad key leaves "Failed to load currencies. Please check your API key and try again." on the page.

## 🧠 What I learned

- The key lives in a git-ignored `config.js` that sets `window.CURRENCY_CONFIG`, so it never reaches the repo
- The `pair` endpoint takes the amount in the URL, so the API does the math and I only format the answer
- `supported_codes` is a list of `[code, name]` pairs, and destructuring them in `forEach` builds both dropdowns in one loop
- Putting `convertBtn.disabled = false` in `finally` re-enables the button even when the request fails

Exchange rates come from ExchangeRate-API.

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 5 Day 1 - Mini-projects - Daily Challenge
