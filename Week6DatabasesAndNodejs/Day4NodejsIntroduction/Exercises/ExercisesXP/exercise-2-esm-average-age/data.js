// Module: data
// Purpose: Export an array of person records (ES Modules).
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-19 | TZ: Asia/Jerusalem
// Notes: Comments in ENGLISH; emojis sparingly.

/**
 * @typedef {Object} Person
 * @property {string} name
 * @property {number} age
 * @property {string} location
 */

/** @type {Person[]} */
export const people = [
  { name: "Avi", age: 28, location: "Be'er Sheva" },
  { name: "Maya", age: 34, location: "Tel Aviv" },
  { name: "Noa", age: 23, location: "Haifa" },
  { name: "Diego", age: 31, location: "Jerusalem" },
];
