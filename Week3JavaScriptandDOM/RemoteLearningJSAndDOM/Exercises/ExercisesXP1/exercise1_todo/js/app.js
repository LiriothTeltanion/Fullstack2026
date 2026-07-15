const listEl = document.getElementById('list');
const inputEl = document.getElementById('newTodo');
const addBtn = document.getElementById('addBtn');
const clearAllBtn = document.getElementById('clearAll');
const filterBtns = document.querySelectorAll('.filters .chip');
const countEl = document.getElementById('count');

let todos = JSON.parse(localStorage.getItem('todos_v1') || '[]');
let filter = 'all';

function save() { localStorage.setItem('todos_v1', JSON.stringify(todos)); }
function uid() { return Math.random().toString(36).slice(2, 9); }

function render() {
  listEl.innerHTML = '';
  const visible = todos.filter(t => filter === 'all' ? true : filter === 'active' ? !t.done : t.done);

  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'item' + (t.done ? ' completed' : '');
    li.dataset.id = t.id;
    li.innerHTML = `
      <input type="checkbox" ${t.done ? 'checked' : ''} aria-label="toggle">
      <span class="txt"></span>
      <button class="rm" aria-label="remove">Remove</button>
    `;
    li.querySelector('.txt').textContent = t.text;
    listEl.appendChild(li);
  });

  const c = todos.length;
  countEl.textContent = c + (c === 1 ? ' item' : ' items');
  clearAllBtn.disabled = c === 0;
  clearAllBtn.setAttribute('aria-disabled', String(c === 0));
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
}

function addTodo() {
  const text = inputEl.value.trim();
  if (!text) return;
  todos.push({ id: uid(), text, done: false });
  inputEl.value = '';
  save(); render();
}

function toggle(id) {
  const t = todos.find(x => x.id === id);
  if (t) { t.done = !t.done; save(); render(); }
}

function removeOne(id) {
  todos = todos.filter(x => x.id !== id);
  save(); render();
}

function removeAll() {
  todos = [];
  save(); render();
}

addBtn.addEventListener('click', addTodo);
inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
clearAllBtn.addEventListener('click', removeAll);

listEl.addEventListener('click', e => {
  const li = e.target.closest('.item');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.matches('input[type="checkbox"]')) toggle(id);
  if (e.target.matches('.rm')) removeOne(id);
});

filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filter = btn.dataset.filter;
  render();
}));

render();
