// Sieve of Eratosthenes: every prime number up to limit.
export function primesUpTo(limit) {
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
