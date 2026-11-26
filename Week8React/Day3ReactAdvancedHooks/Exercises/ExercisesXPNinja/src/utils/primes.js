export const MAX_LIMIT = 200000;

// Sieve of Eratosthenes within the input range used by the demo.
export function primesUpTo(limit) {
  if (!Number.isInteger(limit) || limit < 2 || limit > MAX_LIMIT) return [];
  const isPrime = new Array(limit + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let n = 2; n * n <= limit; n += 1) {
    if (isPrime[n]) {
      for (let multiple = n * n; multiple <= limit; multiple += n) {
        isPrime[multiple] = false;
      }
    }
  }
  const primes = [];
  isPrime.forEach((flag, n) => {
    if (flag) primes.push(n);
  });
  return primes;
}
