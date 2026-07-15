const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const highsEl = document.getElementById('highscores');

let cells = [];
let timer = null;
let moleTimer = null;
let timeLeft = 30;
let score = 0;
const HS_KEY = 'mole_highscores_v1';

function buildGrid() {
  grid.innerHTML = '';
  cells = [];
  for (let i = 0; i < 9; i++) {
    const c = document.createElement('button');
    c.className = 'cell';
    c.setAttribute('aria-label', 'cell');
    c.dataset.index = i;
    c.textContent = '🕳️';
    grid.appendChild(c);
    cells.push(c);
  }
  grid.addEventListener('click', onCellClick);
}

function spawnMole() {
  cells.forEach(c => { c.classList.remove('active'); c.textContent = '🕳️'; });
  const idx = Math.floor(Math.random() * cells.length);
  const cell = cells[idx];
  cell.classList.add('active');
  cell.textContent = '🐹';
}

function tick() {
  timeLeft--;
  timeEl.textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) endGame();
}

function onCellClick(e) {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  if (cell.classList.contains('active')) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    spawnMole();
  }
}

function startGame() {
  score = 0; scoreEl.textContent = 'Score: 0';
  timeLeft = 30; timeEl.textContent = 'Time: 30s';
  startBtn.disabled = true;
  spawnMole();
  timer = setInterval(tick, 1000);
  moleTimer = setInterval(spawnMole, 800);
}

function endGame() {
  clearInterval(timer);
  clearInterval(moleTimer);
  cells.forEach(c => { c.classList.remove('active'); c.textContent = '🕳️'; });
  startBtn.disabled = false;
  timeEl.textContent = 'Done!';
  maybeRecordHighScore(score);
  renderHS();
}

function loadHS() { return JSON.parse(localStorage.getItem(HS_KEY) || '[]'); }
function saveHS(list) { localStorage.setItem(HS_KEY, JSON.stringify(list)); }

function maybeRecordHighScore(sc) {
  let list = loadHS();
  const lowest = list[4]?.score ?? -1;
  if (list.length < 5 || sc > lowest) {
    const name = prompt(`New High Score: ${sc}! Enter your name:`) || 'Anonymous';
    list.push({ name, score: sc, at: Date.now() });
    list.sort((a, b) => b.score - a.score || a.at - b.at);
    list = list.slice(0, 5);
    saveHS(list);
  }
}

function renderHS() {
  const list = loadHS();
  highsEl.innerHTML = '';
  list.forEach((row, i) => {
    const li = document.createElement('li');
    li.textContent = `#${i + 1} ${row.name} — ${row.score}`;
    highsEl.appendChild(li);
  });
}

startBtn.addEventListener('click', startGame);

buildGrid();
renderHS();
