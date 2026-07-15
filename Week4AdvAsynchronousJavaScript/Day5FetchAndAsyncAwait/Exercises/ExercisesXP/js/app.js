// Exercises XP — Fetch API & Async/Await
// Emojis allowed; no hearts. Comments in English.

const out = document.getElementById('out');
const btn1 = document.getElementById('ex1');
const btn2 = document.getElementById('ex2');
const btn3 = document.getElementById('ex3');
const btn4 = document.getElementById('ex4');

// Giphy API key from the prompt
const GIPHY_KEY = 'hpvZycW22qCjn5cRM1xtWB8NKq4dQ2My';

function logPanel(title, data){
  const time = new Date().toLocaleTimeString();
  out.textContent = `[${time}] ${title}\n` + (typeof data === 'string' ? data : JSON.stringify(data, null, 2));
}

function handleStatus(res){
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res;
}

// Exercise 1: hilarious
btn1.addEventListener('click', async () => {
  const url = `https://api.giphy.com/v1/gifs/search?q=hilarious&rating=g&api_key=${GIPHY_KEY}`;
  try {
    const res = await fetch(url);
    handleStatus(res);
    const json = await res.json();
    console.log('Exercise 1 — full JSON:', json); // Console.log the JS object
    const count = json?.data?.length ?? 0;
    const first = json?.data?.[0];
    logPanel('Exercise 1 — summary', {
      count,
      first_title: first?.title ?? '(none)',
      first_url: first?.url ?? '(none)'
    });
  } catch (err) {
    console.error('Exercise 1 — error:', err);
    logPanel('Exercise 1 — error', String(err));
  }
});

// Exercise 2: sun, limit 10, offset 2
btn2.addEventListener('click', async () => {
  const url = new URL('https://api.giphy.com/v1/gifs/search');
  url.searchParams.set('q', 'sun');
  url.searchParams.set('limit', '10');
  url.searchParams.set('offset', '2'); // starting position 2
  url.searchParams.set('rating', 'g');
  url.searchParams.set('api_key', GIPHY_KEY);

  try {
    const res = await fetch(url.toString());
    handleStatus(res);
    const json = await res.json();
    console.log('Exercise 2 — full JSON:', json); // Console.log the JS object
    const titles = (json?.data ?? []).map(g => g.title);
    logPanel('Exercise 2 — titles (10, offset 2)', titles);
  } catch (err) {
    console.error('Exercise 2 — error:', err);
    logPanel('Exercise 2 — error', String(err));
  }
});

// Exercise 3: Async function (SWAPI), no .then()
btn3.addEventListener('click', async () => {
  const url = 'https://www.swapi.tech/api/starships/9/';
  try {
    const res = await fetch(url);
    handleStatus(res);
    const obj = await res.json();
    console.log('Exercise 3 — objectStarWars.result:', obj.result);
    logPanel('Exercise 3 — starship name', obj?.result?.properties?.name ?? '(unknown)');
  } catch (err) {
    console.error('Exercise 3 — error:', err);
    logPanel('Exercise 3 — error', String(err));
  }
});

// Exercise 4: Analyze — run the exact semantics
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  logPanel('Exercise 4', 'calling');
  let result = await resolveAfter2Seconds();
  console.log(result);
  logPanel('Exercise 4', result);
}

btn4.addEventListener('click', asyncCall);
