"""Exercises XP Gold for Week 1, Day 1.

Author: Kevin Cusnir
Creative signature: Lirioth Teltanion
Created: 2025-10-18
Requirements reviewed: 2026-09-11

Overview:
    1. String multiplication techniques
    2. Month-to-season mapping with membership testing
"""

# Month groups keep the beginner-level conditionals readable.
SPRING_MONTHS = (3, 4, 5)
SUMMER_MONTHS = (6, 7, 8)
AUTUMN_MONTHS = (9, 10, 11)
WINTER_MONTHS = (12, 1, 2)


def exercise_1_hello_world() -> None:
    """Print the required eight lines with one ``print(...)`` statement.

    Demonstrates the power of string repetition with the * operator
    and newline character placement.

    Example Output:
        Hello world
        Hello world
        Hello world
        Hello world
        I love python
        I love python
        I love python
        I love python
    """
    print("Hello world\n" * 4 + "I love python\n" * 3 + "I love python")


def get_valid_month() -> int:
    """Read and return a whole-number month from 1 through 12.

    Continuously prompts until valid input is received.
    Handles non-numeric input and out-of-range values.

    Returns:
        int: Month number between 1 and 12 (inclusive)

    Example Interaction:
        Enter month (1-12): abc
        Please enter a whole number.
        Enter month (1-12): 15
        Month must be between 1 and 12.
        Enter month (1-12): 4
        (returns 4)
    """
    while True:
        try:
            month = int(input("Enter month (1-12): "))
            if 1 <= month <= 12:
                return month
            print("Month must be between 1 and 12.")
        except ValueError:
            print("Please enter a whole number.")


def get_season(month: int) -> str:
    """Return the season for a valid month number.

    Args:
        month: Month number (1-12)

    Returns:
        One of ``Spring``, ``Summer``, ``Autumn``, or ``Winter``.

    Raises:
        ValueError: If ``month`` is outside 1 through 12.

    Example:
        >>> get_season(4)
        'Spring'
    """
    if not 1 <= month <= 12:
        raise ValueError("month must be between 1 and 12")

    if month in SPRING_MONTHS:
        return "Spring"
    elif month in SUMMER_MONTHS:
        return "Summer"
    elif month in AUTUMN_MONTHS:
        return "Autumn"
    return "Winter"


def exercise_2_season() -> None:
    """Ask for a valid month and print its season.

    Prompts user for a month number (1-12) and displays the corresponding
    season.

    Example Interaction:
        Enter month (1-12): 7
        Summer
    """
    month = get_valid_month()
    season = get_season(month)
    print(season)


def main() -> None:
    """Run all Gold exercises in sequence."""
    exercise_1_hello_world()
    exercise_2_season()


if __name__ == "__main__":
    main()
