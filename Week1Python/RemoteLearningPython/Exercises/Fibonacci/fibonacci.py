"""Remote Exercise: Fibonacci.

Three ways to work with the Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, ...
"""


def fibonacci_list(count):
    """Return the first `count` Fibonacci numbers with a simple loop."""
    sequence = []
    a, b = 0, 1
    for _ in range(count):
        sequence.append(a)
        a, b = b, a + b
    return sequence


def fibonacci_recursive(n, memo=None):
    """Return the n-th Fibonacci number (0-based) with recursion and a memo dict.

    Without the memo, fibonacci_recursive(35) repeats millions of calls.
    """
    if memo is None:
        memo = {}
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fibonacci_recursive(n - 1, memo) + fibonacci_recursive(n - 2, memo)
    return memo[n]


def is_fibonacci(number):
    """Check if a number is in the sequence by walking up to it."""
    a, b = 0, 1
    while a < number:
        a, b = b, a + b
    return a == number


def main():
    count = int(input("How many Fibonacci numbers? "))
    print(fibonacci_list(count))
    print(f"Number {count - 1} by recursion: {fibonacci_recursive(count - 1)}")
    print("Fibonacci number 90:", fibonacci_recursive(90))
    for number in (21, 22, 144):
        answer = "yes" if is_fibonacci(number) else "no"
        print(f"Is {number} a Fibonacci number? {answer}")


if __name__ == "__main__":
    main()
