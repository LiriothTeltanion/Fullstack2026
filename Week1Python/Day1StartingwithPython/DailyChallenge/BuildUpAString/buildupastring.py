"""Module: buildupastring
Purpose: Interactive Day 1 challenge for validating and transforming strings.
Author: Kevin Cusnir "Lirioth"
Created: 2025-10-18
Last Updated: 2025-10-19

Features:
    - Length validation (exactly 10 characters)
    - Character analysis (first/last)
    - Progressive string building
    - Random string shuffling
"""

from __future__ import annotations

import random


def validate_length(text: str) -> tuple[bool, str]:
    """
    Validate if text is exactly 10 characters long.
    
    Args:
        text: String to validate
        
    Returns:
        Tuple of (is_valid, feedback_message)
        
    Examples:
        >>> validate_length("hello")
        (False, 'String not long enough.')
        >>> validate_length("abcdefghij")
        (True, 'Perfect string')
        >>> validate_length("toolongtext")
        (False, 'String too long.')
    """
    if len(text) < 10:
        return False, "String not long enough."
    if len(text) > 10:
        return False, "String too long."
    return True, "Perfect string"


def build_up_text(text: str) -> None:
    """
    Print the incremental build-up of the provided text.
    
    Shows progressive string building, one character at a time.
    
    Args:
        text: String to build up
        
    Example:
        >>> build_up_text("abc")
        a
        ab
        abc
    """
    built = ""
    for ch in text:
        built += ch
        print(built)


def jumble_text(text: str) -> str:
    """
    Return a shuffled version of the provided text.
    
    Uses random.shuffle() for character rearrangement.
    Note: Output varies on each run due to randomization.
    
    Args:
        text: String to shuffle
        
    Returns:
        Shuffled string with same characters in random order
        
    Example:
        >>> result = jumble_text("abc")
        >>> len(result) == 3 and sorted(result) == ["a", "b", "c"]
        True
    """
    chars = list(text)
    # ✅ Shuffle a copy so the original text stays unchanged for later steps.
    random.shuffle(chars)
    return "".join(chars)


def main() -> None:
    """
    Run the interactive build-up challenge.
    
    Workflow:
    1. Prompt user for 10-character string
    2. Validate length
    3. Display first and last characters
    4. Build string progressively
    5. Show shuffled version
    
    Example Session:
        Enter a string (must be exactly 10 characters): abcdefghij
        Perfect string
        First character: a
        Last character: j
        a
        ab
        abc
        abcd
        abcde
        abcdef
        abcdefg
        abcdefgh
        abcdefghi
        abcdefghij
        Jumbled string: fdgijbaech
    """
    user_input = input("Enter a string (must be exactly 10 characters): ")
    is_valid, message = validate_length(user_input)
    print(message)
    if not is_valid:
        return

    print("First character:", user_input[0])
    print("Last character:", user_input[-1])

    build_up_text(user_input)

    print("Jumbled string:", jumble_text(user_input))


if __name__ == "__main__":
    main()
