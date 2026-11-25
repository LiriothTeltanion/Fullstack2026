"""Module: exercisesxpgold
Purpose: Enhanced Day 2 exercises exploring lists, control flow, and games.
Author: Kevin Cusnir "Lirioth"
Created: 2025-10-18
Last Updated: 2025-10-19

Overview:
    1. List concatenation techniques
    2. Modulo operations and filtering
    3. Index searching algorithms
    4. Built-in max/min functions
    5. Character classification
    6. String searching methods
    7. Mathematical optimization (Gauss formula)
    8. Data type conversions
    9. Interactive game development
"""

from __future__ import annotations

# Exercises XP Gold

# Exercise 1: Concatenate lists (without +)
def exercise_1_concatenate_lists() -> None:
    """
    Concatenate two lists using extend() instead of + operator.
    
    Demonstrates list mutation vs creating new objects.
    
    Example Output:
        exercise1: [1, 2, 3, 4, 5, 6]
    """
    a = [1, 2, 3]
    b = [4, 5, 6]
    c = list(a)          # make a copy
    c.extend(b)          # concatenate using extend
    print("exercise1:", c)


# Exercise 2: Range of numbers (multiples of 5 and 7)
def exercise_2_multiples() -> None:
    """
    Print numbers between 1500-2500 that are divisible by both 5 and 7.
    
    Numbers divisible by both 5 and 7 are divisible by 35 (LCM).
    
    Example Output:
        1505
        1540
        1575
        ...
        2485
    """
    for n in range(1500, 2501):
        if n % 5 == 0 and n % 7 == 0:
            print(n)


# Exercise 3: Check the index
def exercise_3_check_index() -> None:
    """Find the index of a name in a list or report not found."""
    names = ['Samus', 'Cortana', 'V', 'Link', 'Mario', 'Cortana', 'Samus']
    user = input("Enter a name: ")
    if user in names:
        print("index:", names.index(user))
    else:
        print("name not found")


# Exercise 4: Greatest Number
def ask_int(prompt: str) -> int:
    """Keep asking until the user types a whole number."""
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a whole number.")


def exercise_4_greatest_number() -> None:
    """Find the maximum of three user-provided numbers."""
    x = ask_int("Enter 1st number: ")
    y = ask_int("Enter 2nd number: ")
    z = ask_int("Enter 3rd number: ")
    print("The greatest number is:", max(x, y, z))


# Exercise 5: The Alphabet (vowel or consonant)
def exercise_5_vowels_consonants() -> None:
    """Classify each letter of the alphabet as vowel or consonant."""
    alphabet = "abcdefghijklmnopqrstuvwxyz"
    vowels = "aeiou"
    for ch in alphabet:
        if ch in vowels:
            print(ch, "- vowel")
        else:
            print(ch, "- consonant")


# Exercise 6: Words and letters
def exercise_6_words_and_letters() -> None:
    """Find the index of a letter in 7 user-provided words."""
    words = []
    for _ in range(7):
        words.append(input("Enter a word: "))
    letter = input("Enter a single character: ")[:1]
    for w in words:
        idx = w.find(letter)
        if idx != -1:
            print(w, "-> index", idx)
        else:
            print("'", letter, "' not found in '", w, "'", sep="")


# Exercise 7: Min, Max, Sum
def exercise_7_min_max_sum() -> None:
    """
    Calculate min, max, and sum of numbers 1 to 1,000,000.
    
    ✅ OPTIMIZED: Use mathematical formula instead of creating 1 million items
    Old approach: nums = list(range(1, 1_000_001))  # ❌ ~8MB memory, slow!
    New approach: Calculate directly with formulas ⚡
    """
    n = 1_000_000
    min_val = 1
    max_val = n
    sum_val = n * (n + 1) // 2  # 💡 Gauss formula: sum of 1 to n
    print(f"min: {min_val}, max: {max_val}, sum: {sum_val}")


# Exercise 8: List and Tuple
def exercise_8_list_and_tuple() -> None:
    """Convert comma-separated input into both list and tuple."""
    data = input("Enter comma-separated numbers: ")
    lst = [x.strip() for x in data.split(",")]
    tup = tuple(lst)
    print(lst)
    print(tup)


# Exercise 9: Random number guessing
def exercise_9_guessing_game() -> None:
    """Play a number guessing game (1-9) and track wins/losses."""
    import random
    wins = 0
    losses = 0
    while True:
        guess = input("Guess 1-9 (or 'q' to quit): ").strip().lower()
        if guess == 'q':
            break
        if not guess.isdigit():
            # ⚠️ Reject non-numeric guesses before converting to int.
            print("invalid")
            continue
        guess = int(guess)
        if guess < 1 or guess > 9:
            print("out of range")
            continue
        num = random.randint(1, 9)
        if guess == num:
            print("Winner")
            wins += 1
        else:
            print("better luck next time (number was", num, ")")
            losses += 1
    print("games won:", wins, "games lost:", losses)


if __name__ == "__main__":
    """Run all exercises when script is executed directly."""
    exercise_1_concatenate_lists()
    exercise_2_multiples()
    exercise_3_check_index()
    exercise_4_greatest_number()
    exercise_5_vowels_consonants()
    exercise_6_words_and_letters()
    exercise_7_min_max_sum()
    exercise_8_list_and_tuple()
    exercise_9_guessing_game()
