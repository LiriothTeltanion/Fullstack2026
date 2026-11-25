"""
File: exercisesxpgoldinheritance.py
Purpose: Single-file solutions for "Exercises XP Gold" — Inheritance. 🧠🧬
Author: Kevin "Lirioth" Cusnir
Date: 2025-10-09 | TZ: Asia/Jerusalem

Content:
  • BankAccount with auth-gated deposit/withdraw. 🏦🔐
  • MinimumBalanceAccount inheriting BankAccount. 📉
  • ATM class with simple CLI: login, deposit, withdraw. 🏧

Notes:
  - Comments/docstrings are in ENGLISH.
  - Deposit/withdraw require prior authentication via .authenticate().
  - ATM __init__ validates inputs and immediately shows the main menu per spec.
"""

from __future__ import annotations

from typing import List, Optional, Sequence, Union


Number = int  # As per spec: positive int amounts for deposit/withdraw


# =========================
# Part I & III — BankAccount
# =========================
class BankAccount:
    """A bank account with basic operations and authentication.

    Attributes:
        balance (int): current balance
        username (str): login username
        password (str): login password
        authenticated (bool): whether the user has successfully authenticated
    """

    def __init__(self, balance: Number = 0, username: str = "", password: str = "") -> None:
        self._ensure_int(balance, name="balance", allow_zero=True)
        self.balance: Number = int(balance)
        self.username: str = str(username)
        self.password: str = str(password)
        self.authenticated: bool = False

    # ---- helpers ----
    @staticmethod
    def _ensure_int(value: Union[int, float], *, name: str, allow_zero: bool = False) -> None:
        if not isinstance(value, int):
            raise TypeError(f"{name} must be an int.")
        if allow_zero:
            if value < 0:
                raise ValueError(f"{name} must be >= 0.")
        else:
            if value <= 0:
                raise ValueError(f"{name} must be > 0.")

    def authenticate(self, username: str, password: str) -> bool:
        """Authenticate by username/password; set authenticated to True on success."""
        if self.username == username and self.password == password:
            self.authenticated = True
        else:
            self.authenticated = False
        return self.authenticated

    def deposit(self, amount: Number) -> None:
        """Deposit a positive int to the balance. Requires authentication."""
        if not self.authenticated:
            raise PermissionError("Not authenticated. Call authenticate() first.")
        self._ensure_int(amount, name="amount", allow_zero=False)
        self.balance += amount
        print(f"Deposited {amount}. New balance: {self.balance}")

    def withdraw(self, amount: Number) -> None:
        """Withdraw a positive int from the balance. Requires authentication."""
        if not self.authenticated:
            raise PermissionError("Not authenticated. Call authenticate() first.")
        self._ensure_int(amount, name="amount", allow_zero=False)
        self.balance -= amount
        print(f"Withdrew {amount}. New balance: {self.balance}")


# ==================================
# Part II — MinimumBalanceAccount (MBA)
# ==================================
class MinimumBalanceAccount(BankAccount):
    """Bank account that enforces a minimum balance threshold."""

    def __init__(self, balance: Number = 0, username: str = "", password: str = "", *, minimum_balance: Number = 0) -> None:
        super().__init__(balance=balance, username=username, password=password)
        self._ensure_int(minimum_balance, name="minimum_balance", allow_zero=True)
        self.minimum_balance: Number = int(minimum_balance)

    def withdraw(self, amount: Number) -> None:
        """Withdraw only if resulting balance stays >= minimum_balance. Requires authentication."""
        if not self.authenticated:
            raise PermissionError("Not authenticated. Call authenticate() first.")
        self._ensure_int(amount, name="amount", allow_zero=False)
        if self.balance - amount < self.minimum_balance:
            raise ValueError(
                f"Withdrawal denied: balance would drop below minimum ({self.minimum_balance})."
            )
        self.balance -= amount
        print(f"Withdrew {amount}. New balance: {self.balance}")


# ========================
# Part IV — ATM (bonus) 🏧
# ========================
class ATM:
    """Very small CLI ATM that logs in to an account and performs operations.

    __init__(account_list, try_limit):
        - Validates the account list types.
        - Validates try_limit: if invalid, raise an Exception and then set try_limit=2.
        - Sets current_tries=0 and calls show_main_menu().
    """

    def __init__(self, account_list: Sequence[BankAccount], try_limit: int = 2) -> None:
        # Validate account_list items
        if not isinstance(account_list, (list, tuple)):
            raise TypeError("account_list must be a list/tuple of BankAccount instances.")
        for acc in account_list:
            if not isinstance(acc, BankAccount):
                raise TypeError("All items in account_list must be instances of BankAccount or subclasses.")

        self.account_list: List[BankAccount] = list(account_list)

        # Validate try_limit as positive number: raise, then set to 2 per spec
        try:
            if not isinstance(try_limit, int) or try_limit <= 0:
                raise ValueError("try_limit must be a positive int.")
            self.try_limit: int = int(try_limit)
        except Exception as e:
            print(f"[ATM] Invalid try_limit: {e}")
            print("[ATM] Falling back to try_limit = 2")
            self.try_limit = 2

        self.current_tries: int = 0

        # Start main menu loop immediately, as requested
        self.show_main_menu()

    # ---- Menus ----
    def show_main_menu(self) -> None:
        """Top-level menu: log in or exit."""
        while True:
            print("\n=== ATM Main Menu 🏧 ===")
            print("1) Log in")
            print("2) Exit")
            choice = input("Select an option (1-2): ").strip()
            if choice == "1":
                username = input("Username: ").strip()
                password = input("Password: ").strip()
                self.log_in(username, password)
            elif choice == "2":
                print("Goodbye! 👋")
                break
            else:
                print("Invalid selection.")

    def log_in(self, username: str, password: str) -> None:
        """Try to authenticate against all accounts. Loop until success or try limit reached."""
        # reset tries when a new login session starts
        self.current_tries = 0
        while self.current_tries < self.try_limit:
            # Search for a matching account
            for acc in self.account_list:
                if acc.authenticate(username, password):
                    print(f"Welcome, {acc.username}! ✅")
                    self.show_account_menu(acc)
                    # On returning from account menu, clear auth for safety
                    acc.authenticated = False
                    return
            # If no match
            self.current_tries += 1
            remaining = self.try_limit - self.current_tries
            print(f"Login failed. Tries left: {remaining}")
            if remaining <= 0:
                print("Max tries reached. Shutting down.")
                return
            # Ask again
            username = input("Username: ").strip()
            password = input("Password: ").strip()

    def show_account_menu(self, account: BankAccount) -> None:
        """Account operations: deposit, withdraw, exit."""
        while True:
            print(f"\n=== Account Menu for {account.username} ===")
            print(f"Balance: {account.balance}")
            print("1) Deposit")
            print("2) Withdraw")
            print("3) Exit to Main Menu")
            choice = input("Select an option (1-3): ").strip()
            if choice == "1":
                try:
                    amt = int(input("Amount to deposit (positive int): ").strip())
                    account.deposit(amt)
                except Exception as e:
                    print(f"Error: {e}")
            elif choice == "2":
                try:
                    amt = int(input("Amount to withdraw (positive int): ").strip())
                    account.withdraw(amt)
                except Exception as e:
                    print(f"Error: {e}")
            elif choice == "3":
                print("Returning to Main Menu.")
                return
            else:
                print("Invalid selection.")
                

# ===============
# Tiny demo ✅
# ===============
if __name__ == "__main__":
    # Example accounts
    a = BankAccount(balance=500, username="kevin", password="1234")
    b = MinimumBalanceAccount(balance=1000, username="maya", password="blue", minimum_balance=200)

    # Uncomment to run the ATM interactive CLI.
    # This will start the menu immediately (per spec) and block until exit.
    #
    # ATM([a, b], try_limit=3)
    #
    # Tip: Use the above credentials to test. Ctrl+C to abort.

    # Non-interactive smoke test for auth + ops
    if a.authenticate("kevin", "1234"):
        a.deposit(100)
        a.withdraw(50)
        a.authenticated = False
    if b.authenticate("maya", "blue"):
        try:
            b.withdraw(900)  # would drop below 200 -> should raise
        except Exception as e:
            print(f"Expected error: {e}")
        b.withdraw(700)  # 1000 - 700 = 300 >= 200 OK
        b.authenticated = False
