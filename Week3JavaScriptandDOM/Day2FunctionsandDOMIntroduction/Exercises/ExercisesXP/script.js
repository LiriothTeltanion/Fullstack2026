// Exercises XP — JS
// Code kept short and simple, with small English comments.
// Open index.html in a browser and click the buttons to run each exercise.

// Utility to print into a <pre> and console
function printOut(id, lines) {
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines);
  const el = document.getElementById(id);
  if (el) el.textContent = text;
  console.log(text);
}
function clearAll() {
  for (let i = 1; i <= 7; i++) {
    const el = document.getElementById("out" + i);
    if (el) el.textContent = "";
  }
}
function runAll() {
  ex1();
  ex2();
  ex3();
  ex4();
  ex5();
  ex6();
  ex7();
}

// --------------------
// Exercise 1
// --------------------
function displayNumbersDivisible(divisor = 23) {
  // Loop 0..500 and collect numbers divisible by 'divisor'
  let nums = [];
  let sum = 0;
  for (let n = 0; n <= 500; n++) {
    if (n % divisor === 0) {
      nums.push(n);
      sum += n;
    }
  }
  return { nums, sum };
}
function ex1() {
  const { nums, sum } = displayNumbersDivisible(23);
  printOut("out1", ["Numbers:", nums.join(" "), "Sum: " + sum]);
}

// --------------------
// Exercise 2
// --------------------
const stock = {
  banana: 6,
  apple: 0,
  pear: 12,
  orange: 32,
  blueberry: 1,
};
const prices = {
  banana: 4,
  apple: 2,
  pear: 1,
  orange: 1.5,
  blueberry: 10,
};
const shoppingList = ["banana", "orange", "apple"]; // 1 each

function myBill() {
  // Return total price of shoppingList (only items in stock).
  let total = 0;
  for (let i = 0; i < shoppingList.length; i++) {
    const item = shoppingList[i];
    if (item in stock && stock[item] > 0) {
      // add to total using prices object
      total += prices[item] || 0;
      // Bonus: decrease stock by 1
      stock[item] -= 1;
    }
  }
  return total;
}
function ex2() {
  const total = myBill();
  const snapshot = JSON.stringify(stock, null, 2);
  printOut("out2", ["Total: $" + total, "Stock after purchase:\n" + snapshot]);
}

// --------------------
// Exercise 3
// --------------------
function changeEnough(itemPrice, amountOfChange) {
  // amountOfChange = [quarters, dimes, nickels, pennies]
  const values = [0.25, 0.1, 0.05, 0.01];
  let sum = 0;
  for (let i = 0; i < amountOfChange.length; i++) {
    sum += amountOfChange[i] * values[i];
  }
  return sum >= itemPrice;
}
function ex3() {
  const a = changeEnough(4.25, [25, 20, 5, 0]);
  const b = changeEnough(14.11, [2, 100, 0, 0]);
  const c = changeEnough(0.75, [0, 0, 20, 5]);
  printOut("out3", [
    "changeEnough(4.25, [25,20,5,0]) => " + a,
    "changeEnough(14.11,[2,100,0,0]) => " + b,
    "changeEnough(0.75, [0,0,20,5]) => " + c,
  ]);
}

// --------------------
// Exercise 4
// --------------------
// Simple validators for prompt loops
function askNumber(msg) {
  // Keep prompting until a valid number is provided
  while (true) {
    const s = prompt(msg);
    if (s !== null && s.trim() !== "" && !isNaN(Number(s))) {
      return Number(s);
    }
    alert("Please enter a valid number.");
  }
}
function askText(msg) {
  while (true) {
    const s = prompt(msg);
    if (s !== null && s.trim() !== "") return s.trim();
    alert("Please enter a valid text.");
  }
}
function hotelCost(nights) {
  return nights * 140;
}

function planeRideCost(dest) {
  // Return price per destination (case-insensitive)
  const d = dest.toLowerCase();
  if (d === "london") return 183;
  if (d === "paris") return 220;
  return 300;
}
function rentalCarCost(days) {
  // 40 per day; >10 days -> 5% discount
  const cost = days * 40;
  return days > 10 ? cost * 0.95 : cost;
}

function totalVacationCost() {
  // Gather inputs here (bonus approach: single prompt flow)
  const nights = askNumber("How many hotel nights?");
  const dest = askText("Destination? (e.g., London, Paris, other)");
  const days = askNumber("How many car rental days?");

  const hotel = hotelCost(nights);
  const plane = planeRideCost(dest);
  const car = rentalCarCost(days);

  const total = hotel + plane + car;
  return { nights, dest, days, hotel, plane, car, total };
}
function ex4() {
  const r = totalVacationCost();
  printOut("out4", [
    `Hotel: $${r.hotel} (${r.nights} nights)`,
    `Plane: $${r.plane} (to ${r.dest})`,
    `Car:   $${r.car} (${r.days} days)`,
    "-------------------------",
    `Total: $${r.total}`,
  ]);
}

// --------------------
// Exercise 5 (DOM)
// --------------------
function ex5() {
  const out = [];
  // Retrieve the div and log it
  const div = document.getElementById("container");
  out.push("DIV text: " + div.textContent);

  // Change "Pete" to "Richard"
  const lists = document.querySelectorAll("#ex5-root ul.list");
  const firstList = lists[0];
  const secondList = lists[1];

  firstList.querySelectorAll("li")[1].textContent = "Richard";

  // Delete the second <li> of the second <ul>
  const secondUlLis = secondList.querySelectorAll("li");
  if (secondUlLis[1]) secondUlLis[1].remove(); // remove "Sarah"

  // Change the name of the first <li> of each <ul> to "Kevin"
  for (let i = 0; i < lists.length; i++) {
    const li = lists[i].querySelector("li");
    if (li) li.textContent = "Kevin";
  }

  // Add class student_list to both <ul>
  for (let i = 0; i < lists.length; i++) lists[i].classList.add("student_list");
  // Add classes university and attendance to the first <ul>
  firstList.classList.add("university", "attendance");

  // Style: light blue background + padding for the <div>
  div.style.backgroundColor = "lightblue";
  div.style.padding = "10px";

  // Hide the <li> that contains the text node “Dan” (it lives in the second <ul>)
  const liDan = [...secondList.querySelectorAll("li")].find(li => li.textContent.trim() === "Dan");
  if (liDan) liDan.style.display = "none";

  // Add a border to the <li> that contains “Richard” (second <li> of the first <ul> after rename)
  const liRichard = firstList.querySelector("li:nth-child(2)");
  if (liRichard && /richard/i.test(liRichard.textContent))
    liRichard.style.border = "1px solid #6aa9ff";

  // Change font size of the whole body
  document.body.style.fontSize = "16px";

  // Bonus: if the div bg is light blue, alert “Hello x and y”
  // We'll use the first <li> of each <ul>
  if (div.style.backgroundColor === "lightblue") {
    const x = firstList.querySelector("li")?.textContent || "UserX";
    const y = secondList.querySelector("li")?.textContent || "UserY";
    alert(`Hello ${x} and ${y}`);
  }

  // Dump some state
  out.push("First UL classes: " + firstList.className);
  out.push("Second UL length: " + secondList.querySelectorAll("li").length);
  printOut("out5", out);
}

// --------------------
// Exercise 6 (DOM)
// --------------------
function ex6() {
  const root = document.getElementById("ex6-root");
  const nav = root.querySelector("#navBar, #socialNetworkNavigation");

  // Change id from navBar to socialNetworkNavigation
  nav.setAttribute("id", "socialNetworkNavigation");

  // Add a new <li> "Logout"
  const ul = nav.querySelector("ul");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode("Logout"));
  ul.appendChild(li);

  // Show first and last link text
  const first = ul.firstElementChild;
  const last = ul.lastElementChild;
  printOut("out6", ["First link: " + first.textContent, "Last link: " + last.textContent]);
}

// --------------------
// Exercise 7 (DOM)
// --------------------
function ex7() {
  const section = document.querySelector(".listBooks");
  section.innerHTML = ""; // reset

  // Two demo books
  const allBooks = [
    {
      title: "Atomic Habits",
      author: "James Clear",
      image: "https://covers.openlibrary.org/b/id/9255891-L.jpg",
      alreadyRead: true,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      image: "https://covers.openlibrary.org/b/id/8231856-L.jpg",
      alreadyRead: false,
    },
  ];

  for (let i = 0; i < allBooks.length; i++) {
    const b = allBooks[i];
    const div = document.createElement("div");
    div.className = "book";

    const h4 = document.createElement("h4");
    h4.textContent = `${b.title} written by ${b.author}`;
    if (b.alreadyRead) h4.classList.add("red");

    const img = document.createElement("img");
    img.src = b.image;
    img.alt = b.title;
    img.width = 100;

    div.appendChild(h4);
    div.appendChild(img);
    section.appendChild(div);
  }
  printOut("out7", "Rendered " + allBooks.length + " books.");
}
