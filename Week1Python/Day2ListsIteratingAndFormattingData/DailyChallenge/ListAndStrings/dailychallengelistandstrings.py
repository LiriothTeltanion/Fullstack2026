"""Module: dailychallengelistandstrings
Purpose: Day 2 challenge utilities for list generation and string cleanup.
Author: Kevin Cusnir "Lirioth"
Created: 2025-10-18
Last Updated: 2025-10-19

Overview:
    1. Generate multiples of a number
    2. Collapse consecutive duplicate characters
"""

from __future__ import annotations

# Daily Challenge : Lists & Strings

from typing import List


def multiples(number: int, length: int) -> List[int]:
    """
    Return the first ``length`` multiples of ``number``.
    
    Args:
        number: The base number to multiply
        length: How many multiples to generate (must be non-negative)
        
    Returns:
        List of multiples [number*1, number*2, ..., number*length]
        
    Raises:
        ValueError: If length is negative
        
    Examples:
        >>> multiples(7, 5)
        [7, 14, 21, 28, 35]
        >>> multiples(-3, 4)
        [-3, -6, -9, -12]
        >>> multiples(5, 0)
        []
    """

    if length < 0:
        raise ValueError("length must be non-negative")
    return [number * i for i in range(1, length + 1)]


def collapse_duplicates(word: str) -> str:
    """
    Collapse consecutive duplicate characters in ``word``.
    
    Only consecutive duplicates are removed. Non-consecutive repeats remain.
    Case-sensitive: 'A' and 'a' are different characters.
    
    Args:
        word: String to process
        
    Returns:
        String with consecutive duplicates collapsed to single character
        
    Examples:
        >>> collapse_duplicates("ppoollee")
        'pole'
        >>> collapse_duplicates("bookkeeper")
        'bokeper'
        >>> collapse_duplicates("AaAa")
        'AaAa'
        >>> collapse_duplicates("")
        ''
    """

    if not word:
        return ""
    result = [word[0]]
    for ch in word[1:]:
        if ch != result[-1]:
            result.append(ch)
    return "".join(result)


def _cli() -> None:
    """Reproduce the original interactive behaviour."""

    try:
        number = int(input("Enter a number: "))
        length = int(input("Enter length: "))
        print(multiples(number, length))  # inside the try: a negative length raises ValueError too
    except ValueError:
        print("Please enter valid integers for number and length (length can't be negative).")

    word = input("Enter a word: ")
    print(collapse_duplicates(word))


if __name__ == "__main__":
    _cli()
