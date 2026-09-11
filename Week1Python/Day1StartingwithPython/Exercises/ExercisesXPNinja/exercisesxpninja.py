"""Week 1, Day 1 Exercises XP Ninja.

The functions stay deliberately small so each result can be predicted, run,
explained, and tested independently.
"""

from __future__ import annotations


def exercise_1_path_explanation() -> None:
    """Explain why Python can be launched outside its install directory."""
    print("Run 'python' on Windows to open the Python console.")
    print(
        "PATH lists directories that the operating system searches for "
        "executable programs."
    )
    print("Python works from any directory when its executable is on PATH.")


def exercise_2_python_launcher() -> None:
    """Explain the Windows ``py`` command used for the second exercise."""
    print("Run 'py' on Windows to open Python with the Python Launcher.")
    print("The Windows 'py' command is a launcher, not a PowerShell alias.")


def exercise_3_outputs() -> None:
    """Print the results after recording a prediction above each expression."""
    # Guess: True. Both comparisons in the chain are true.
    print(3 <= 3 < 9)

    # Guess: True. Both equality comparisons are true.
    print(3 == 3 == 3)

    # Guess: False. Zero is a falsy integer.
    print(bool(0))

    # Guess: False. The integer 5 and the string "5" are different types.
    print(bool(5 == "5"))

    # Guess: True. Both comparisons become True, then True equals True.
    print(bool(4 == 4) == bool("4" == "4"))

    # Guess: False. None becomes False, and bool(False) stays False.
    print(bool(bool(None)))

    x = 1 == True  # Guess: True, because bool is a subclass of int.
    y = 1 == False  # Guess: False, because False behaves like zero.
    a = True + 4  # Guess: 5, because True behaves like one.
    b = False + 10  # Guess: 10, because False behaves like zero.

    print("x is", x)
    print("y is", y)
    print("a:", a)
    print("b:", b)


def exercise_4_text_length() -> None:
    """Print the character count with one statement after ``my_text``."""
    my_text = (
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do "
        "eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim "
        "ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut "
        "aliquip ex ea commodo consequat. Duis aute irure dolor in "
        "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla "
        "pariatur. Excepteur sint occaecat cupidatat non proident, sunt in "
        "culpa qui officia deserunt mollit anim id est laborum."
    )
    print(len(my_text))


def contains_letter_a(sentence: str) -> bool:
    """Return whether ``sentence`` contains the letter A in either case."""
    return "a" in sentence.casefold()


def exercise_5_longest_without_a() -> None:
    """Track successively longer sentences that do not contain A or a."""
    longest_sentence = ""

    print("Enter sentences without the letter A. Press Enter to finish.")

    while True:
        sentence = input("Sentence: ")

        if sentence == "":
            break

        if contains_letter_a(sentence):
            print("That sentence contains the letter A. Try again.")
            continue

        if len(sentence) > len(longest_sentence):
            longest_sentence = sentence
            print(
                "Congratulations! New longest sentence: "
                f"{len(longest_sentence)} characters."
            )

    if longest_sentence:
        print("Longest valid sentence:", longest_sentence)
    else:
        print("No valid sentence was recorded.")


def main() -> None:
    """Run all five Ninja exercises in order."""
    exercise_1_path_explanation()
    exercise_2_python_launcher()
    exercise_3_outputs()
    exercise_4_text_length()
    exercise_5_longest_without_a()


if __name__ == "__main__":
    main()
