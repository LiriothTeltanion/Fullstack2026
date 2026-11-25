"""Remote Exercise: Find Duplicates.

Read a line of words or numbers and report which ones appear more than once.
"""


def find_duplicates(items):
    """Return each repeated item once, in the order it was first repeated."""
    seen = set()
    duplicates = []
    for item in items:
        if item in seen and item not in duplicates:
            duplicates.append(item)
        seen.add(item)
    return duplicates


def count_repeats(items):
    """Return a dict item -> how many times it appears, only for repeats."""
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return {item: amount for item, amount in counts.items() if amount > 1}


def remove_duplicates(items):
    """Keep the first copy of every item and keep the original order."""
    result = []
    for item in items:
        if item not in result:
            result.append(item)
    return result


def main():
    line = input("Type some words or numbers separated by spaces: ")
    items = line.lower().split()

    duplicates = find_duplicates(items)
    if not duplicates:
        print("No duplicates, every item is unique.")
        return

    print("Duplicates:", ", ".join(duplicates))
    for item, amount in count_repeats(items).items():
        print(f"  {item} appears {amount} times")
    print("Without duplicates:", " ".join(remove_duplicates(items)))


if __name__ == "__main__":
    main()
