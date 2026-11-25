"""Remote Exercise: List Comprehension.

Six small tasks, each solved with one list (or dict/set) comprehension.
"""

NUMBERS = [3, 8, 12, 5, 7, 20, 1, 14]
WORDS = ["sky", "python", "map", "coffee", "dictionary", "is", "loop"]
MATRIX = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
PRICES = {"tea": 9, "coffee": 12, "cake": 18, "water": 5}


def squares_of_evens(numbers):
    """1. Square only the even numbers."""
    return [n * n for n in numbers if n % 2 == 0]


def long_words_upper(words, min_length=4):
    """2. Keep words with at least min_length letters, in uppercase."""
    return [word.upper() for word in words if len(word) >= min_length]


def flatten(matrix):
    """3. Turn a list of rows into one flat list (two for clauses)."""
    return [value for row in matrix for value in row]


def word_lengths(words):
    """4. A dict comprehension: word -> number of letters."""
    return {word: len(word) for word in words}


def cheap_items(prices, limit=10):
    """5. Filter a dictionary: only the items that cost less than limit."""
    return {item: price for item, price in prices.items() if price < limit}


def unique_first_letters(words):
    """6. A set comprehension: each first letter once, sorted."""
    return sorted({word[0] for word in words})


def main():
    print("1. Squares of evens:", squares_of_evens(NUMBERS))
    print("2. Long words:", long_words_upper(WORDS))
    print("3. Flat matrix:", flatten(MATRIX))
    print("4. Word lengths:", word_lengths(WORDS))
    print("5. Cheap items:", cheap_items(PRICES))
    print("6. First letters:", unique_first_letters(WORDS))

    # The same task as number 1, written with a normal loop, to compare.
    loop_result = []
    for n in NUMBERS:
        if n % 2 == 0:
            loop_result.append(n * n)
    print("Loop gives the same list:", loop_result == squares_of_evens(NUMBERS))


if __name__ == "__main__":
    main()
