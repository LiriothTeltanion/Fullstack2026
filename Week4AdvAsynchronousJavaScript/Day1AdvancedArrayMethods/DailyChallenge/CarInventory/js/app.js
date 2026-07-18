// 🚗 Daily Challenge — Car Inventory
// Sample data
const inventory = [
  { id: 1, car_make: "Lincoln", car_model: "Navigator", car_year: 2009 },
  { id: 2, car_make: "Mazda", car_model: "Miata MX-5", car_year: 2001 },
  { id: 3, car_make: "Honda", car_model: "Accord", car_year: 1983 },
  { id: 4, car_make: "Land Rover", car_model: "Defender Ice Edition", car_year: 2010 },
  { id: 5, car_make: "Honda", car_model: "Accord", car_year: 1995 },
];

/**
 * Part I — Return a string describing the first Honda in the inventory.
 * If none is found, return a helpful message.
 */
function getCarHonda(carInventory) {
  const honda = carInventory.find(car => car.car_make === "Honda");
  if (!honda) {
    return "🙈 No Honda found in the inventory.";
  }
  return `✅ This is a ${honda.car_make} ${honda.car_model} from ${honda.car_year}.`;
}

/**
 * Part II — Return a NEW array sorted by car_year ascending (non-mutating).
 */
function sortCarInventoryByYear(carInventory) {
  return [...carInventory].sort((a, b) => a.car_year - b.car_year);
}

// --- Minimal UI wiring for demo ---
const firstHondaEl = document.getElementById("firstHonda");
const sortedEl = document.getElementById("sorted");

document.getElementById("btnHonda").addEventListener("click", () => {
  firstHondaEl.textContent = getCarHonda(inventory);
});

document.getElementById("btnSort").addEventListener("click", () => {
  const sorted = sortCarInventoryByYear(inventory);
  sortedEl.innerHTML = "";
  for (const car of sorted) {
    const card = document.createElement("div");
    card.className = "car";
    card.innerHTML = `
      <h4>🚘 ${car.car_make} <span class="muted">${car.car_model}</span></h4>
      <div>📅 Year: <strong>${car.car_year}</strong></div>
      <div>🆔 ID: <code>${car.id}</code></div>
    `;
    sortedEl.appendChild(card);
  }
});

// Auto-run first Honda on load
firstHondaEl.textContent = getCarHonda(inventory);

// Export for testing (optional)
window.getCarHonda = getCarHonda;
window.sortCarInventoryByYear = sortCarInventoryByYear;
