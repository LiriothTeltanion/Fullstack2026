# 🧮 React Calculator

A separate Week 14 pocket calculator with clickable number and operator keys, a result display and a React class component. The [Week 8 form calculator](../../../../Week8React/Day4MiniProject/DailyChallenge/Calculator/) remains a different exercise.

## Run

Use Node 22.13+ or a supported newer version.

```bash
npm ci
npm run dev
```

Open the loopback address printed by Vite. `npm run build` creates the static production files in `dist/`; `npm run preview` serves that build locally. No API, account, database or environment secret is needed.

## Controls and behavior

- Click digits 0–9, a decimal point and one of the four arithmetic operators, then equals.
- AC resets the entire calculation; backspace edits the current entry; ± changes its sign.
- Focus the calculator to type numbers, a decimal point and `+ - * /`. Enter evaluates, Escape clears and Backspace deletes. Tab to a keypad button and press Enter or Space to activate that button. The `=` key evaluates from anywhere on the keypad.
- Operations evaluate immediately from left to right: `2 + 3 × 4 = 20`. This is a pocket calculator, without algebraic precedence or expression parsing.
- Selecting another operator before entering the next number replaces the pending operator. Equals without a complete pair does nothing. A digit after a result starts a fresh entry; an operator continues from the result.
- Division by zero and numeric overflow show an accessible error. A digit or AC starts a clean calculation after an error.

Input accepts up to 16 digits. JavaScript numbers use IEEE 754 floating point: arbitrary-precision integer or financial arithmetic is outside this exercise. A relative-error rule, adapted from the tested Week 8 utility, removes ordinary decimal noise without erasing tiny values. Very large/small computed results may use scientific notation.

## Structure and verification

`App` extends React `Component`; its state is updated with functional `setState`. Each `CalculatorKey` receives its label, action and callback through props and invokes that callback on click. Pure state transitions live in `src/calculator.js`.

```bash
npm test
npm run build
npm audit
```

The Node test entry exercises transitions and error recovery independently of React. Browser verification should additionally cover the real buttons, keyboard, responsive result display and focus states. Test results are evidence of these bounded behaviors, not of personal learning mastery.

The design uses local CSS and system fonts. There are no third-party image assets. Source and tests contain original code and a short implementation summary, rather than a copy of the course prompt.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
