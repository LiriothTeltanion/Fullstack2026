# Currency Converter

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/currency-converter-e742522f43.svg" width="100%" alt="Progress card for Currency Converter">

</div>

A currency converter I built for the Week 5 Day 1 daily challenge. It uses the [ExchangeRate-API](https://www.exchangerate-api.com/) to load every supported currency into two dropdowns and convert an amount with live rates. A switch button (⇅) swaps the two currencies.

## Files

```
CurrencyConverter/
├── index.html          # Page, styles and script
└── config.example.js   # Template for your local config.js
```

## Setup and run

1. Create a free account at ExchangeRate-API and copy your key.
2. Copy the template and put your key in `config.js` instead of the placeholder. Local `config.js` files are ignored by Git, so the key stays on your machine.

```powershell
Copy-Item .\config.example.js .\config.js
```

3. Open `index.html` in your browser. No server needed.

Pick the "From" and "To" currencies, type an amount and click **Convert** or press Enter. The defaults are 1 USD to ILS.

## How it works

Two endpoints:

- `GET /v6/{API_KEY}/codes` on page load, to fill the dropdowns
- `GET /v6/{API_KEY}/pair/{FROM}/{TO}/{AMOUNT}` when you convert. The amount goes straight in the URL and the response has `conversion_rate` and `conversion_result`.

```javascript
async function loadSupportedCurrencies() {
    const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
    const data = await response.json();
    populateCurrencySelects(data.supported_codes);
}

function switchCurrencies() {
    const fromValue = fromCurrencySelect.value;
    const toValue = toCurrencySelect.value;

    fromCurrencySelect.value = toValue;
    toCurrencySelect.value = fromValue;

    convertCurrency();
}
```

The page shows a spinner during requests, checks that the amount is a positive number and both currencies are selected, and shows a message for a bad key, network errors or API errors. If the currencies don't load, check the key in `config.js` and the browser console.

## What I learned

- Using async/await with a real API that needs a key
- Keeping the key out of Git with a local config file
- Building dropdowns from API data and showing loading and error states

## Credits

Exchange rates come from [ExchangeRate-API](https://www.exchangerate-api.com/).
