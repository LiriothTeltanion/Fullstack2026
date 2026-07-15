const targetEl = document.getElementById('target');
const optionsEl = document.getElementById('options');
const diffSel = document.getElementById('difficulty');
const feedbackEl = document.getElementById('feedback');
const countdownEl = document.getElementById('countdown');
const nextBtn = document.getElementById('next');
const hardBox = document.getElementById('hardInputs');
const rIn = document.getElementById('r');
const gIn = document.getElementById('g');
const bIn = document.getElementById('b');
const guessBtn = document.getElementById('guessBtn');

let target = [0, 0, 0];
let timer = null;
let mode = diffSel.value;

function rand(n = 256) { return Math.floor(Math.random() * n); }
function rgb(arr) { return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`; }

function newRound() {
  if (timer) clearInterval(timer);
  countdownEl.textContent = '';
  feedbackEl.textContent = '';

  target = [rand(), rand(), rand()];
  targetEl.style.background = rgb(target);
  optionsEl.innerHTML = '';

  if (mode === 'hard') {
    hardBox.classList.remove('hide');
  } else {
    hardBox.classList.add('hide');
    const count = mode === 'easy' ? 3 : 6;
    const correctIndex = Math.floor(Math.random() * count);

    for (let i = 0; i < count; i++) {
      const val = i === correctIndex ? target : [rand(), rand(), rand()];
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = rgb(val);
      btn.addEventListener('click', () => guessArray(val));
      optionsEl.appendChild(btn);
    }
  }
}

function endRound(correct) {
  feedbackEl.textContent = correct ? '✅ Correct!' : '❌ Not quite.';

  if (correct) {
    let remain = 5;
    countdownEl.textContent = `Next color in ${remain}s…`;
    timer = setInterval(() => {
      remain--;
      if (remain <= 0) {
        clearInterval(timer);
        newRound();
      } else {
        countdownEl.textContent = `Next color in ${remain}s…`;
      }
    }, 1000);
  }
}

function guessArray(guess) {
  const correct = guess[0] === target[0] && guess[1] === target[1] && guess[2] === target[2];

  document.querySelectorAll('.option').forEach(b => {
    const [r, g, bv] = b.textContent.match(/\d+/g).map(Number);
    const ok = r === target[0] && g === target[1] && bv === target[2];
    b.classList.add(ok ? 'correct' : 'wrong');
    b.disabled = true;
  });

  endRound(correct);
}

function guessHard() {
  const r = Number(rIn.value);
  const g = Number(gIn.value);
  const b = Number(bIn.value);
  const correct = r === target[0] && g === target[1] && b === target[2];
  endRound(correct);
}

diffSel.addEventListener('change', e => { mode = e.target.value; newRound(); });
nextBtn.addEventListener('click', newRound);
guessBtn.addEventListener('click', guessHard);
newRound();
