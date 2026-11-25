# xp_oop_modules_all.py
# 💡 Full-Stack Coding Bootcamp - OOP & Modules XP (All In One)
# ------------------------------------------------------------
# This single Python file contains solutions for all exercises:
# 1) Currency class (dunder methods)
# 2) "Import" exercise (kept as a simple function here)
# 3) Random 5-letter string using `string` + `random`
# 4) Current date (datetime.date)
# 5) Time until next Jan 1st (datetime.datetime)
# 6) Minutes lived from birthdate
# 7) Fake users with Faker (optional install)
#
# 📝 Notes:
# - Comments are in English and include emojis for friendliness.
# - Code stays simple and readable.
# - Exercise 2 asks to create a separate module (func.py). Since we
#   are combining everything into ONE file, we simply define the
#   function `sum_two_numbers` and call it here to demonstrate usage. ✨
#
# Run:
#   python xp_oop_modules_all.py
#
# Enjoy! 🐍💙


# -----------------------------
# 🌟 Exercise 1: Currencies
# -----------------------------

class Currency:
    def __init__(self, currency, amount):
        # ✅ Store text label and numeric amount
        self.currency = currency  # e.g., "dollar", "shekel"
        self.amount = amount      # e.g., 5

    def _label(self):
        # 🏷️ Helper for pluralization with a simple "s" rule
        return self.currency if self.amount == 1 else f"{self.currency}s"

    def __str__(self):
        # 📄 Human-friendly string
        return f"{self.amount} {self._label()}"

    def __repr__(self):
        # 🧪 Debug representation (same as __str__ for this task)
        return f"{self.amount} {self._label()}"

    def __int__(self):
        # 🔢 Convert to int (just the amount)
        return int(self.amount)

    def __add__(self, other):
        # ➕ Return an int result (as per expected output)
        if isinstance(other, (int, float)):
            return int(self.amount + other)  # Sum numeric
        if isinstance(other, Currency):
            if self.currency != other.currency:
                # 🚫 Different labels -> TypeError with exact message
                raise TypeError(f"Cannot add between Currency type <{self.currency}> and <{other.currency}>")
            return int(self.amount + other.amount)  # Sum amounts
        return NotImplemented  # 🧱 Unsupported type

    def __iadd__(self, other):
        # 🔁 In-place addition; mutate self.amount
        if isinstance(other, (int, float)):
            self.amount += other
            return self
        if isinstance(other, Currency):
            if self.currency != other.currency:
                raise TypeError(f"Cannot add between Currency type <{self.currency}> and <{other.currency}>")
            self.amount += other.amount
            return self
        return NotImplemented

    def __radd__(self, other):
        # ↩️ Support 5 + c1 -> int
        if isinstance(other, (int, float)):
            return int(other + self.amount)
        return NotImplemented


# --------------------------------
# 🌟 Exercise 2: "Import" (inline)
# --------------------------------

def sum_two_numbers(a, b):
    """Print the sum of two numbers. 🧠➕"""
    result = a + b
    print(f"Sum is: {result} ✅")


# -----------------------------------------
# 🌟 Exercise 3: Random 5-letter string
# -----------------------------------------

import string
import random

def random_five_letters():
    """Return a random string of length 5 using ascii letters only. 🎯"""
    letters = string.ascii_letters  # ABC...XYZabc...xyz
    result = ""
    for _ in range(5):  # 🎲 pick 5 times
        result += random.choice(letters)
    return result


# ------------------------------
# 🌟 Exercise 4: Current date
# ------------------------------

from datetime import date, datetime

def show_today_date():
    """Print today's date in ISO format. 📌"""
    today = date.today()
    print(f"Today's date is: {today.isoformat()} ✅")


# -------------------------------------------------------
# 🌟 Exercise 5: Time left until next January 1st
# -------------------------------------------------------

def time_until_new_year():
    """Display how much time remains until Jan 1st of next year. 🎉"""
    now = datetime.now()
    next_jan_1 = datetime(year=now.year + 1, month=1, day=1)
    delta = next_jan_1 - now
    days = delta.days
    seconds = delta.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    print(f"Time left until Jan 1: {days}d {hours}h {minutes}m {secs}s 🎇")


# ---------------------------------------------------
# 🌟 Exercise 6: Birthday → minutes lived
# ---------------------------------------------------

def minutes_lived(birthdate_str):
    """Print how many minutes you have lived since your birthdate (YYYY-MM-DD). ⏱️"""
    # 🧭 Parse the date string
    birth = datetime.strptime(birthdate_str, "%Y-%m-%d")
    now = datetime.now()
    delta = now - birth
    minutes = int(delta.total_seconds() // 60)
    # Format with commas for readability, e.g., 1,234,567
    print(f"You have lived ~ {minutes:,} minutes 🫶")


# -------------------------------------------
# 🌟 Exercise 7: Faker — fake users list
# -------------------------------------------

def generate_users(n):
    """Return a list of n users (dicts) with name, address, and language_code. 🧑‍💻
    Requires the 'faker' package. If not installed, prints guidance and returns [].
    """
    try:
        from faker import Faker  # Import here to avoid ImportError at file load time
    except ImportError:
        print("Faker is not installed. Install with: pip install faker 🚀")
        return []

    fake = Faker()
    users = []
    for _ in range(n):
        user = {
            "name": fake.name(),                                  # 🪪 Fake full name
            "address": fake.address().replace("\n", ", "),        # 🏠 One-line address
            "language_code": fake.language_code()                 # 🗣️ e.g., 'en', 'he'
        }
        users.append(user)
    return users


# -----------------------
# 🧪 Demo runner (simple)
# -----------------------

def run_all_demos():
    print("===== Exercise 1: Currency dunder methods =====")
    c1 = Currency('dollar', 5)
    c2 = Currency('dollar', 10)
    c3 = Currency('shekel', 1)
    c4 = Currency('shekel', 10)

    print(c1)            # 5 dollars
    print(int(c1))       # 5
    print(repr(c1))      # 5 dollars
    print(c1 + 5)        # 10
    print(c1 + c2)       # 15
    print(c1)            # 5 dollars (unchanged)

    c1 += 5
    print(c1)            # 10 dollars

    c1 += c2
    print(c1)            # 20 dollars

    try:
        print(c1 + c3)   # ❌ TypeError
    except TypeError as e:
        print(f"TypeError: {e}")

    print("\n===== Exercise 2: 'Import' (inline function call) =====")
    sum_two_numbers(7, 13)  # Expected: "Sum is: 20 ✅"

    print("\n===== Exercise 3: Random 5-letter string =====")
    print(f"Random string: {random_five_letters()} ✨")

    print("\n===== Exercise 4: Current date =====")
    show_today_date()

    print("\n===== Exercise 5: Time until New Year =====")
    time_until_new_year()

    print("\n===== Exercise 6: Minutes lived (example with 1994-06-16) =====")
    minutes_lived("1994-06-16")

    print("\n===== Exercise 7: Faker fake users (5) =====")
    users = generate_users(5)
    if users:
        for i, u in enumerate(users, start=1):
            print(f"{i}. {u['name']} | {u['language_code']} | {u['address']} ✅")


if __name__ == "__main__":
    # 🚀 Run everything in a simple, linear way
    run_all_demos()
