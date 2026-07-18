// Simple scripts for the three exercises
// My style: short and beginner-friendly comments

// --------- Exercise 1 (GET) ---------
// On page load, I read the URL query string and print it as JSON.
function readGetParams() {
  const params = new URLSearchParams(window.location.search);
  const obj = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  const out = document.getElementById("getOutput");
  out.textContent = Object.keys(obj).length ? JSON.stringify(obj, null, 2) : "{}";
}
readGetParams();

// --------- Exercise 2 (POST) ---------
// Nothing to do in JS here. The point is to observe the "Network" tab
// after submitting the POST form (needs running on http://, not file://).

// --------- Exercise 3 (JSON Mario) ---------
const marioGame = {
  detail: "An amazing game!",
  characters: {
    mario: {
      description: "Small and jumpy. Likes princesses.",
      height: 10,
      weight: 3,
      speed: 12,
    },
    bowser: {
      description: "Big and green, Hates princesses.",
      height: 16,
      weight: 6,
      speed: 4,
    },
    princessPeach: {
      description: "Beautiful princess.",
      height: 12,
      weight: 2,
      speed: 2,
    },
  },
};

// 1) Convert the JS object to a JSON string
function makeMarioJSON(withDebugger = false) {
  const jsonText = JSON.stringify(marioGame); // compact
  const pretty = JSON.stringify(marioGame, null, 2); // with spaces

  // What happens to nested objects?
  // -> They stay as nested objects in JSON form (just text now).

  if (withDebugger) {
    // I can pause here and inspect values in DevTools
    // (Click the button "Make JSON (with debugger)" and the debugger will stop.)
    debugger;
  }

  const out = document.getElementById("marioOutput");
  out.textContent = pretty; // show the pretty version
}

// Hook up buttons
document.getElementById("marioRun").addEventListener("click", () => makeMarioJSON(false));
document.getElementById("marioDebug").addEventListener("click", () => makeMarioJSON(true));
