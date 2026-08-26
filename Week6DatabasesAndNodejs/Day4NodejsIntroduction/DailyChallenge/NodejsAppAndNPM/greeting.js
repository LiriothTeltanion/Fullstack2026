// Module: greeting
// Purpose: Export a simple greet() function using CommonJS.
// Author: Kevin "Lirioth" Cusnir
// Date: 2025-10-19 | TZ: Asia/Jerusalem

/**
 * Return a personalized greeting.
 * @param {string} name - Person's name
 * @returns {string}
 */
function greet(name) {
  const who = typeof name === "string" && name.trim() ? name.trim() : "friend";
  return `Hello, ${who}! 👋`;
}

module.exports = { greet };
