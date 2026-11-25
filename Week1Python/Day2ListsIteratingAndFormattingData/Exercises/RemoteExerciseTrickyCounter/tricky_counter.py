"""Remote Exercise: Tricky Counter.

Count from one number to another in either direction, then count what is
inside the result without using collections.Counter.
"""


def tricky_count(start, end, step=1):
    """Count from start to end (both included), going up or down.

    The step is always given as a positive number; the direction comes from
    comparing start and end. That is the tricky part: range() needs a
    negative step to count down and leaves the end number out.
    """
    if step == 0:
        raise ValueError("step cannot be 0")
    step = abs(step)
    if start <= end:
        return list(range(start, end + 1, step))
    return list(range(start, end - 1, -step))


def count_kinds(numbers):
    """Count even, odd, positive, negative and zero values by hand."""
    counts = {"even": 0, "odd": 0, "positive": 0, "negative": 0, "zero": 0}
    for number in numbers:
        if number % 2 == 0:
            counts["even"] += 1
        else:
            counts["odd"] += 1

        if number > 0:
            counts["positive"] += 1
        elif number < 0:
            counts["negative"] += 1
        else:
            counts["zero"] += 1
    return counts


def count_digits(numbers):
    """Count how many times each digit appears in all the numbers together."""
    digit_counts = {}
    for number in numbers:
        for digit in str(abs(number)):
            digit_counts[digit] = digit_counts.get(digit, 0) + 1
    return dict(sorted(digit_counts.items()))


def main():
    raw = input("Start, end and step (for example 10 -3 3): ").split()
    start, end, step = (int(value) for value in raw)

    numbers = tricky_count(start, end, step)
    print("Counted:", ", ".join(str(n) for n in numbers))
    print(f"That is {len(numbers)} numbers.")
    for kind, amount in count_kinds(numbers).items():
        print(f"{kind:>8}: {amount}")
    print("Digits used:", count_digits(numbers))


if __name__ == "__main__":
    main()
