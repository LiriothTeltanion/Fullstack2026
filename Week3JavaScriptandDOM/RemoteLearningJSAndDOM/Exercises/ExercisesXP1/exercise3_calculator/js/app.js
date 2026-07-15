const display = document.getElementById('display');

let memory = 0;
let acc = null;   // accumulator
let op = null;    // pending operator
let fresh = true; // start new number with next digit?

function setDisplay(val) {
  const s = String(val);
  display.textContent = s.length > 14 ? Number(val).toExponential(8) : s;
}

function inputDigit(ch) {
  if (fresh) {
    display.textContent = (ch === '.') ? '0.' : ch;
    fresh = false;
  } else {
    if (ch === '.' && display.textContent.includes('.')) return;
    display.textContent = (display.textContent === '0' && ch !== '.') ? ch : display.textContent + ch;
  }
}

function compute(x, y, op) {
  switch (op) {
    case '+': return x + y;
    case '-': return x - y;
    case '*': return x * y;
    case '/': return y === 0 ? NaN : x / y;
    default:  return y;
  }
}

function doOp(next) {
  const x = parseFloat(display.textContent);
  if (acc === null) {
    acc = x;
  } else if (op) {
    acc = compute(acc, x, op);
    setDisplay(acc);
  }
  op = next;
  fresh = true;
}

function equals() {
  if (!op) return;
  const x = parseFloat(display.textContent);
  acc = compute(acc, x, op);
  setDisplay(acc);
  op = null;
  fresh = true;
}

function clearAll() { acc = null; op = null; fresh = true; setDisplay(0); }
function toggleSign() { setDisplay(parseFloat(display.textContent) * -1); }
function percent() { setDisplay(parseFloat(display.textContent) / 100); }

// Memory
function mplus() { memory += parseFloat(display.textContent) || 0; }
function mminus() { memory -= parseFloat(display.textContent) || 0; }
function mr() { setDisplay(memory); fresh = true; }
function mc() { memory = 0; }

document.querySelector('.keys').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;

  if (b.dataset.num) return inputDigit(b.dataset.num);
  if (b.dataset.dot) return inputDigit('.');
  if (b.dataset.op)  return doOp(b.dataset.op);

  switch (b.dataset.act) {
    case 'equals':  return equals();
    case 'clear':   return clearAll();
    case 'sign':    return toggleSign();
    case 'percent': return percent();
    case 'mplus':   return mplus();
    case 'mminus':  return mminus();
    case 'mr':      return mr();
    case 'mc':      return mc();
  }
});

setDisplay(0);
