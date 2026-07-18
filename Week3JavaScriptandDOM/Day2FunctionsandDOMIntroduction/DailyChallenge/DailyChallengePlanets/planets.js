// planets.js
const planets = [
  { name: "Mercury", color: "#8b8b8b", moons: 0 },
  { name: "Venus", color: "#c4a64b", moons: 0 },
  { name: "Earth", color: "#2e86de", moons: 1 },
  { name: "Mars", color: "#e67e22", moons: 2 },
  { name: "Jupiter", color: "#d5b895", moons: 4 },
  { name: "Saturn", color: "#f4d03f", moons: 7 },
  { name: "Uranus", color: "#48c9b0", moons: 5 },
  { name: "Neptune", color: "#5dade2", moons: 1 },
];

const space = document.querySelector(".listPlanets");
space.style.display = "flex";
space.style.flexWrap = "wrap";
space.style.gap = "20px";

planets.forEach(p => {
  const planet = document.createElement("div");
  planet.className = "planet";
  planet.style.background = p.color;
  planet.style.margin = "10px";
  planet.textContent = p.name;
  space.appendChild(planet);

  for (let i = 0; i < p.moons; i++) {
    const moon = document.createElement("div");
    moon.className = "moon";
    const angle = (i / p.moons) * 360;
    const r = 70;
    moon.style.left = "50%";
    moon.style.top = "50%";
    moon.style.transform = `rotate(${angle}deg) translate(${r}px) rotate(-${angle}deg)`;
    planet.appendChild(moon);
  }
});
