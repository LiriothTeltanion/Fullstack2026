"""Module: exercisesxp
Purpose: Solutions for Day 1 XP exercises covering Python fundamentals.
Author: Kevin Cusnir "Lirioth"
Created: 2025-10-18
Last Updated: 2026-09-10

Overview:
    - Variables and data types
    - Input/output operations
    - Conditional logic and comparisons
    - String manipulation and formatting
    - Boolean operations
    - Type conversions
"""

from __future__ import annotations

# 🎯 Constants
HEIGHT_REQUIREMENT_CM = 145  # Rider must be taller than this threshold.
MY_NAME = "Kevin"  # Used in exercise 8 for name comparison


def exercise_1() -> None:
    """
    Display the classic Hello World message four times.
    
    Uses newline character (\n) to print on separate lines.
    
    Example Output:
        Hello world
        Hello world
        Hello world
        Hello world
    """
    print("Hello world\nHello world\nHello world\nHello world")


def exercise_2() -> None:
    """
    Compute and display (99³) × 8.
    
    Demonstrates operator precedence: exponentiation (**) before multiplication (*).
    
    Example Output:
        7762392
    """
    print((99**3) * 8)


def exercise_3() -> None:
    """
    Demonstrate boolean comparisons and type compatibility.
    
    Shows:
    - Numeric comparisons
    - Equality checks
    - Type mismatch errors (str vs int)
    - Case-sensitive string comparison
    
    Example Output:
        False
        True
        False
        TypeError
        False
    """
    print(5 < 3)            # False
    print(3 == 3)           # True
    print(3 == "3")         # False
    try:
        print("3" > 3)      # TypeError in Python
    except TypeError:
        print("TypeError")
    print("Hello" == "hello")  # False


def exercise_4() -> None:
    """
    Display computer brand using string concatenation.
    
    Example Output:
        I have a ASUS computer.
    """
    computer_brand = "ASUS"
    print("I have a " + computer_brand + " computer.")


def exercise_5() -> None:
    """
    Present personal information using f-string formatting.
    
    Demonstrates modern string interpolation with variables of different types.
    
    Example Output:
        My name is Kevin, I'm 31 years old and my shoe size is 40.
    """
    name = "Kevin"
    age = 31
    shoe_size = 40
    info = f"My name is {name}, I'm {age} years old and my shoe size is {shoe_size}."
    print(info)


def exercise_6() -> None:
    """
    Compare two numbers and conditionally greet the world.
    
    Only prints if the first number is greater than the second.
    
    Example Output:
        Hello World
    """
    a = 10
    b = 5
    if a > b:
        print("Hello World")


def read_int(prompt: str, min_val: int | None = None, max_val: int | None = None) -> int:
    """
    Prompt the user until a valid integer is provided.
    
    Args:
        prompt: Message to display to user
        min_val: Minimum acceptable value (inclusive), optional
        max_val: Maximum acceptable value (inclusive), optional
        
    Returns:
        Valid integer within specified range (if provided)
        
    Example:
        >>> age = read_int("Enter age: ", min_val=0, max_val=120)
        >>> number = read_int("Enter any number: ")
    """
    while True:
        try:
            value = int(input(prompt))
            
            # Validate range if specified
            if min_val is not None and value < min_val:
                # ⚠️ Guard against values that fall below the allowed range.
                print(f"❌ Value must be at least {min_val}")
                continue
            if max_val is not None and value > max_val:
                print(f"❌ Value must be at most {max_val}")
                continue
                
            return value
        except ValueError:
            print("❌ Please enter a valid integer")


def exercise_7() -> None:
    """
    Determine whether a user-provided number is odd or even.
    
    Uses modulo operator (%) to check divisibility by 2.
    
    Example Interaction:
        Enter a number: 7
        Odd
    """
    n = read_int("Enter a number: ")
    if n % 2 == 0:
        print("Even")
    else:
        print("Odd")


def exercise_8() -> None:
    """
    Check if the user shares the same name (case-insensitive).
    
    Demonstrates string normalization with .lower() and .strip().
    
    Example Interaction:
        What is your name? Kevin
        Hey, we have the same name! :)
    """
    user_name = input("What is your name? ")
    if user_name.strip().lower() == MY_NAME.lower():
        print("Hey, we have the same name! :)")
    else:
        print(f"Nice to meet you, {user_name}!")


def exercise_9() -> None:
    """
    Check whether the user's height is strictly over 145cm.
    
    Validates height input and provides helpful feedback.
    
    Example Interaction:
        Enter your height in cm: 150
        ✅ You are tall enough to ride! (150cm)
    """
    height = read_int("Enter your height in cm: ", min_val=0, max_val=300)
    if height > HEIGHT_REQUIREMENT_CM:
        print(f"✅ You are tall enough to ride! ({height}cm)")
    else:
        needed = HEIGHT_REQUIREMENT_CM + 1 - height
        print(f"❌ You need to grow {needed}cm more to ride.")


def main() -> None:
    """Run all Day 1 exercises in sequence."""
    exercise_1()
    exercise_2()
    exercise_3()
    exercise_4()
    exercise_5()
    exercise_6()
    exercise_7()
    exercise_8()
    exercise_9()


if __name__ == "__main__":
    main()
