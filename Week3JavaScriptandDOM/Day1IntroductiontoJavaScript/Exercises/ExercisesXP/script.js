"use strict";

function printOut(id, lines) {
  const pre = document.getElementById(id);
  const text = Array.isArray(lines) ? lines.join("\n") : String(lines);
  pre.textContent = text;
  (Array.isArray(lines) ? lines : [String(lines)]).forEach(x => console.log(x));
}

function clearAll() {
  for (let i = 1; i <= 7; i++) {
    const pre = document.getElementById("out" + i);
    if (pre) pre.textContent = "";
  }
}

// Exercise 1
function ex1() {
  const out = [];
  let people = ["Greg", "Mary", "Devon", "James"];
  out.push("Start: " + JSON.stringify(people));

  // remove Greg
  people.shift();
  out.push('Remove "Greg": ' + JSON.stringify(people));

  // replace James -> Jason
  const j = people.indexOf("James");
  if (j !== -1) people[j] = "Jason";
  out.push('Replace "James" -> "Jason": ' + JSON.stringify(people));

  // add your name
  people.push("Kevin");
  out.push('Add "Kevin": ' + JSON.stringify(people));

  // Mary's index
  out.push("Mary index: " + people.indexOf("Mary"));

  // copy without Mary and Kevin
  const copy = people.slice(1, people.length - 1);
  out.push("Copy (without Mary & Kevin): " + JSON.stringify(copy));

  // index of Foo
  out.push('Index of "Foo": ' + people.indexOf("Foo") + " (no existe => -1)");

  // last
  const last = people[people.length - 1];
  out.push("Last element: " + last);

  // Part II loops
  out.push("\nIterate all:");
  for (let i = 0; i < people.length; i++) {
    out.push(people[i]);
  }

  out.push('Stop after "Devon":');
  for (let i = 0; i < people.length; i++) {
    out.push(people[i]);
    if (people[i] === "Devon") break;
  }

  printOut("out1", out);
}

// Exercise 2
function ex2() {
  const out = [];
  const colors = ["blue", "red", "green", "black", "white"];
  out.push("Colors: " + JSON.stringify(colors));

  out.push("\nMy #n choices:");
  for (let i = 0; i < colors.length; i++) {
    out.push("My #" + (i + 1) + " choice is " + colors[i]);
  }

  out.push("\nBonus (ordinal):");
  function suffix(n) {
    const last = n % 10,
      last2 = n % 100;
    if (last === 1 && last2 !== 11) return n + "st";
    if (last === 2 && last2 !== 12) return n + "nd";
    if (last === 3 && last2 !== 13) return n + "rd";
    return n + "th";
  }
  for (let i = 0; i < colors.length; i++) {
    out.push("My " + suffix(i + 1) + " choice is " + colors[i]);
  }

  printOut("out2", out);
}

// Exercise 3
function ex3() {
  const out = [];
  let num;
  do {
    const answer = prompt("Enter a number (>= 10 to stop):");
    if (answer === null) {
      out.push("Canceled.");
      printOut("out3", out);
      return;
    }
    num = Number(answer);
    if (Number.isNaN(num)) {
      out.push("Not a number: " + answer);
    } else if (num < 10) {
      out.push(num + " is < 10. ask again.");
    }
  } while (Number.isNaN(num) || num < 10);
  out.push("OK: " + num + " >= 10");
  printOut("out3", out);
}

// Exercise 4
function ex4() {
  const out = [];
  const building = {
    numberOfFloors: 4,
    numberOfAptByFloor: {
      firstFloor: 3,
      secondFloor: 4,
      thirdFloor: 9,
      fourthFloor: 2,
    },
    nameOfTenants: ["Sarah", "Dan", "David"],
    numberOfRoomsAndRent: {
      sarah: [3, 990],
      dan: [4, 1000],
      david: [1, 500],
    },
  };

  out.push("Floors: " + building.numberOfFloors);
  out.push("Apts floor 1: " + building.numberOfAptByFloor.firstFloor);
  out.push("Apts floor 3: " + building.numberOfAptByFloor.thirdFloor);

  const second = building.nameOfTenants[1]; // Dan
  const rooms = building.numberOfRoomsAndRent[second.toLowerCase()][0];
  out.push("Second tenant: " + second + ", rooms: " + rooms);

  const sRent = building.numberOfRoomsAndRent.sarah[1];
  const dRent = building.numberOfRoomsAndRent.david[1];
  const danRent = building.numberOfRoomsAndRent.dan[1];
  if (sRent + dRent > danRent) {
    building.numberOfRoomsAndRent.dan[1] = 1200;
    out.push("Dan's rent updated to 1200");
  }

  out.push("\nState:\n" + JSON.stringify(building, null, 2));
  printOut("out4", out);
}

// Exercise 5
function ex5() {
  const out = [];
  const family = { mother: "Janeth", father: "León", son: "Kevin", city: "Beersheba" };

  out.push("Keys:");
  for (const k in family) {
    out.push(k);
  }

  out.push("\nValues:");
  for (const k in family) {
    out.push(family[k]);
  }

  printOut("out5", out);
}

// Exercise 6
function ex6() {
  const details = { my: "name", is: "Rudolf", the: "reindeer" };
  const sentence = "my " + details.my + " is " + details.is + " the " + details.the;
  printOut("out6", sentence);
}

// Exercise 7
function ex7() {
  const names = ["Jack", "Philip", "Sarah", "Amanda", "Bernard", "Kyle"];
  const code = names
    .map(n => n[0].toUpperCase())
    .sort()
    .join("");
  printOut("out7", "Secret society: " + code);
}

window.onload = function () {
  document.getElementById("ex1").onclick = ex1;
  document.getElementById("ex2").onclick = ex2;
  document.getElementById("ex3").onclick = ex3;
  document.getElementById("ex4").onclick = ex4;
  document.getElementById("ex5").onclick = ex5;
  document.getElementById("ex6").onclick = ex6;
  document.getElementById("ex7").onclick = ex7;

  document.getElementById("runAll").onclick = function () {
    clearAll();
    ex1();
    ex2();
    ex3();
    ex4();
    ex5();
    ex6();
    ex7();
  };
  document.getElementById("clearAll").onclick = clearAll;
};
