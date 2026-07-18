// Arrays & Destructuring — Exercises XP Gold (TypeScript, Single File)
// -------------------------------------------------------------------
// Covers: array methods, destructuring, spread, flat/flatMap, map/filter/reduce, and analysis outputs.
// Exported values/functions allow import-based checks. A small demo is included (guarded).
// This version avoids reliance on `Array.prototype.flat(Infinity)` by adding a safe deepFlatten helper.

// ==============
// Exercise 1 : Analyzing the map method
// ==============
// Code:
// [1, 2, 3].map(num => {
//   if (typeof num === 'number') return num * 2;
//   return;
// });
// Since every element is a number, each branch returns num*2; map preserves length.
// Output: [2, 4, 6]
export const analyzeMapOutput: number[] = [1, 2, 3].map((num): number => num * 2);

// ==============
// Exercise 2 : Analyzing the reduce method
// ==============
// Code:
// [[0, 1], [2, 3]].reduce(
//   (acc, cur) => {
//     return acc.concat(cur);
//   },
//   [1, 2],
// );
// Start with [1,2]; concat [0,1] then [2,3] => [1,2,0,1,2,3]
export const analyzeReduceOutput: number[] = [
  [0, 1],
  [2, 3],
].reduce<number[]>((acc, cur) => acc.concat(cur), [1, 2]);

// ==============
// Exercise 3 : Analyze this code
// ==============
// Callback signature of map: (value, index, array). Here `i` is the index of the current element.
// For arrayNum length 6, `i` will be 0,1,2,3,4,5 in successive iterations.
export const arrayNum = [1, 2, 4, 5, 8, 9];
export const indicesObserved: number[] = arrayNum.map((_, i) => i);

// ==============
// Exercise 4 : Nested arrays
// ==============
export const arrayNested = [[1], [2], [3], [[[4]]], [[[5]]]] as (
  number | number[] | number[][] | number[][][]
)[];

// Helper: deep flatten to a 1D array of numbers without requiring `flat(Infinity)`
export function deepFlatten<T = number>(arr: any[]): T[] {
  const out: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      out.push(...deepFlatten<T>(item));
    } else {
      out.push(item as T);
    }
  }
  return out;
}

// Target structure: [1,2,3,[4],[5]]
// Strategy: flatten only the outermost layer once; for any nested subarrays, flatten them by one more level.
export const arrayFlattened: (number | number[])[] = (arrayNested as any[])
  .map(x => x) // copy
  .map(x =>
    Array.isArray(x) && Array.isArray(x[0])
      ? (x as any[]).flat
        ? (x as any[]).flat(1)
        : deepFlatten<number>(x as any[]).slice(0, 1)
      : x
  ) // smart flatten by one for [[[n]]]
  .map(x =>
    Array.isArray(x) && Array.isArray(x[0])
      ? (x as any[]).flat
        ? (x as any[]).flat(1)
        : deepFlatten<number>(x as any[]).slice(0, 1)
      : x
  ) // repeat in case of deeper nests
  .map(x =>
    Array.isArray(x) && !Array.isArray(x[0])
      ? x
      : Array.isArray(x)
        ? [deepFlatten<number>(x as any[])[0]]
        : x
  )
  .map(x => (Array.isArray(x) ? (x.length === 1 ? [x[0]] : x) : x))
  .flatMap(x => (Array.isArray(x) ? [x] : [x])); // ensure shape (number | number[])[]

// Cleaner one-liner equivalent using flatMap + shallow-normalization
export const arrayFlattenedOneLine: (number | number[])[] = (arrayNested as any[]).flatMap(x => {
  if (!Array.isArray(x)) return [x]; // number
  if (Array.isArray(x[0])) {
    // nested
    const d = deepFlatten<number>(x);
    return [[d[0]]]; // keep one level for [4] / [5]
  }
  return [x]; // already [n]
});

// Greeting transformations
export const greeting = [
  ["Hello", "young", "grasshopper!"],
  ["you", "are"],
  ["learning", "fast!"],
];

// 1) To ["Hello young grasshopper!","you are","learning fast!"]
export const greetingJoined: string[] = greeting.map(words => words.join(" "));

// 2) To 'Hello young grasshopper! you are learning fast!'
export const greetingSentence: string = greetingJoined.join(" ");

// Trapped number
export const trapped = [[[[[[[[[[[[[[[[[[[[[[[[[[3]]]]]]]]]]]]]]]]]]]]]]]]]];
export const freed: number[] = deepFlatten<number>(trapped); // -> [3]

// ------------------------
// Optional demo (guarded):
// ------------------------
declare const require: any | undefined;
declare const module: any | undefined;

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  console.log("Ex1 analyzeMapOutput:", analyzeMapOutput); // [2,4,6]
  console.log("Ex2 analyzeReduceOutput:", analyzeReduceOutput); // [1,2,0,1,2,3]
  console.log("Ex3 indicesObserved:", indicesObserved); // [0,1,2,3,4,5]
  console.log("Ex4 arrayFlattened:", arrayFlattened); // [1,2,3,[4],[5]]
  console.log("Ex4 arrayFlattenedOneLine:", arrayFlattenedOneLine);
  console.log("Ex4 greetingJoined:", greetingJoined);
  console.log("Ex4 greetingSentence:", greetingSentence);
  console.log("Ex4 freed:", freed); // [3]
}
