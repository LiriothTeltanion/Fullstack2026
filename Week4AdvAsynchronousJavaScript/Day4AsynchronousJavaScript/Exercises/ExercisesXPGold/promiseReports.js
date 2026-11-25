export async function collectValues(inputs, reportError = console.error) {
  // The result array follows input order even when the promises finish in a different order.
  try {
    return await Promise.all(inputs);
  } catch (error) {
    reportError(error);
    return undefined;
  }
}

export function doubledValues(numbers) {
  return Promise.all(numbers.map(async value => value * 2));
}

if (import.meta.main) {
  const delayed = new Promise(resolve => setTimeout(resolve, 3000, "foo"));
  console.log(await collectValues([Promise.resolve(3), 42, delayed]));
  console.log(await doubledValues([1, 2, 3]));
}
