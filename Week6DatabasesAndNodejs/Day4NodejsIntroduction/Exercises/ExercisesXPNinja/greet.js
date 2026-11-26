export function greeting(name) {
  const displayName = name.trim();
  if (!displayName) throw new Error("Enter a name to greet.");
  return `Welcome to soundcheck, ${displayName}!`;
}
