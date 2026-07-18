// Arrays Methods — Exercises XP Gold (TypeScript, Single File)
// ------------------------------------------------------------
// Covers: sum of array, remove duplicates, remove certain values, repeat string, pad/trim exercises.
// Exports allow import-based checks. A small demo is included (guarded).

// ==============
// Exercise 1: Sum elements
// ==============
export function sumArray(nums: number[]): number {
  return nums.reduce((acc, n) => acc + n, 0);
}

// ==============
// Exercise 2: Remove Duplicates
// ==============
export function uniqueArray<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// ==============
// Exercise 3: Remove certain values
// ==============
// Remove: null, 0, "", false, undefined and NaN
export function cleanArray(arr: any[]): any[] {
  return arr.filter(
    v =>
      !(
        v === null ||
        v === 0 ||
        v === "" ||
        v === false ||
        v === undefined ||
        (typeof v === "number" && Number.isNaN(v))
      )
  );
}
// Sample: [NaN, 0, 15, false, -22, '', undefined, 47, null] -> [15, -22, 47]

// ==============
// Exercise 4: Repeat please!
// ==============
// Implement `repeat` without using String.prototype.repeat (custom loop). Default n = 1.
export function repeat(str: string, n: number = 1): string {
  if (n <= 0) return "";
  let out = "";
  for (let i = 0; i < n; i++) out += str;
  return out;
}

// ==============
// Exercise 5: Turtle & Rabbit
// ==============
export const startLine = "     ||<- Start line";
export function alignRacers() {
  const turtle = "🐢";
  const rabbit = "🐇";

  // PadStart to position them under the start area. Using 9 so that with emoji length (2 code units) we get 7 spaces.
  const turtleAligned = turtle.padStart(9);
  const rabbitAligned = rabbit.padStart(9);

  // What happens when you run: turtle = turtle.trim().padEnd(9, '=') ?
  // - trim() removes leading spaces -> '🐢'
  // - padEnd(9, '=') adds '=' to the right to reach length 9 -> '🐢======='
  const turtleAfterPad = turtleAligned.trim().padEnd(9, "=");

  return { startLine, turtleAligned, rabbitAligned, turtleAfterPad };
}

// ------------------------
// Optional demo (guarded):
// ------------------------
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log("E1 sumArray([1,2,3,4]):", sumArray([1, 2, 3, 4])); // 10

  console.log("E2 uniqueArray:", uniqueArray([1, 1, 2, 3, 3, 4, 5, 5])); // [1,2,3,4,5]

  const sample = [NaN, 0, 15, false, -22, "", undefined, 47, null];
  console.log("E3 cleanArray(sample):", cleanArray(sample)); // [15, -22, 47]

  console.log("E4 repeat('Ha!', 3):", repeat("Ha!", 3)); // "Ha!Ha!Ha!"

  const { startLine: s, turtleAligned, rabbitAligned, turtleAfterPad } = alignRacers();
  console.log(s);
  console.log(turtleAligned);
  console.log(rabbitAligned);
  console.log("turtleAfterPad:", turtleAfterPad); // '🐢======='
}
