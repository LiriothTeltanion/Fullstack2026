"""Remote Exercise: Password Checker.

Ask for a password until it passes every rule, then say how strong it is.
"""

SPECIAL_CHARACTERS = "!@#$%^&*?_-+=."
MIN_LENGTH = 8


def missing_rules(password):
    """Return a list of the rules this password breaks (empty list = valid).

    The list only holds rule descriptions, never the password, so it is safe to print.
    """
    problems = []
    if len(password) < MIN_LENGTH:
        problems.append(f"at least {MIN_LENGTH} characters")
    if not any(char.isupper() for char in password):
        problems.append("one uppercase letter")
    if not any(char.islower() for char in password):
        problems.append("one lowercase letter")
    if not any(char.isdigit() for char in password):
        problems.append("one digit")
    if not any(char in SPECIAL_CHARACTERS for char in password):
        problems.append(f"one special character ({SPECIAL_CHARACTERS})")
    if " " in password:
        problems.append("no spaces")
    return problems


def strength(password):
    """Give a valid password a simple label based on its length."""
    if len(password) >= 14:
        return "strong"
    if len(password) >= 10:
        return "good"
    return "okay"


def main():
    while True:
        password = input("Choose a password: ")
        problems = missing_rules(password)
        if not problems:
            break
        print("Not yet. It still needs:")
        for problem in problems:
            print(f"  - {problem}")

    # Only the verdict is printed: the password itself never reaches the screen or a log.
    print(f"Password accepted. Strength: {strength(password)}")


if __name__ == "__main__":
    main()
