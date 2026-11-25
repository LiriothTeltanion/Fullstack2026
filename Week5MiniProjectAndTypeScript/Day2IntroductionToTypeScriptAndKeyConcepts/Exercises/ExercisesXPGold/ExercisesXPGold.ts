// Exercises XP Gold: TypeScript basics (types, unions, tuples, literal types)
// Run with: node ExercisesXPGold.ts   (Node 22.18+ strips the types)
// Check with: npx tsc --strict --noEmit ExercisesXPGold.ts

// Exercise 1: optional and default parameters
function greet(name: string, greeting: string = "Hello", punctuation?: string): string {
  return `${greeting}, ${name}${punctuation ?? "."}`;
}
console.log("1.", greet("Kevin"), "|", greet("Dana", "Shalom", "!"));

// Exercise 2: a union type, narrowed with typeof
function formatValue(value: string | number | boolean): string {
  if (typeof value === "number") return value.toFixed(2);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return value.trim().toUpperCase();
}
console.log("2.", formatValue(3.14159), formatValue(true), formatValue("  hi  "));

// Exercise 3: a function that returns a tuple
function minMax(numbers: number[]): [min: number, max: number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}
const [lowest, highest] = minMax([7, 2, 9, 4]);
console.log("3. min", lowest, "max", highest);

// Exercise 4: a type alias with readonly and optional properties
type Song = {
  readonly id: number;
  title: string;
  artist: string;
  seconds: number;
  album?: string;
};

const playlist: Song[] = [
  { id: 1, title: "Dream House", artist: "Deafheaven", seconds: 554 },
  { id: 2, title: "Can You Feel My Heart", artist: "Bring Me The Horizon", seconds: 228 },
  { id: 3, title: "Juno", artist: "TesseracT", seconds: 297, album: "Sonder" },
];
// playlist[0].id = 5;  <- error: id is read-only

function totalTime(songs: Song[]): string {
  const total = songs.reduce((sum, song) => sum + song.seconds, 0);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
console.log("4. Playlist length:", totalTime(playlist));
console.log("   Albums:", playlist.map(song => song.album ?? "(single)").join(", "));

// Exercise 5: literal types and an exhaustive switch
type TrafficLight = "red" | "yellow" | "green";

function nextLight(light: TrafficLight): TrafficLight {
  switch (light) {
    case "red":
      return "green";
    case "green":
      return "yellow";
    case "yellow":
      return "red";
    default: {
      // If a new colour is added to the type and not handled, this line stops compiling
      const unreachable: never = light;
      return unreachable;
    }
  }
}

let light: TrafficLight = "red";
const sequence: TrafficLight[] = [light];
for (let i = 0; i < 3; i++) {
  light = nextLight(light);
  sequence.push(light);
}
console.log("5.", sequence.join(" -> "));

export {};
