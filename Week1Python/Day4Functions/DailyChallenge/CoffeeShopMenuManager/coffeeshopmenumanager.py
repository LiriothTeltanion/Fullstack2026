"""Module: coffeeshopmenumanager
Purpose: Day 4 challenge for managing a coffee shop menu with small reusable functions.
Author: Kevin Cusnir
Creative signature: Lirioth Teltanion
Created: 2026-11-22

Features:
    - Create, read, update and delete drinks kept in a dictionary (name -> price)
    - One function per action and one controller loop that only dispatches
    - Extras: price validation, search by name and a percentage discount
"""

import math

Menu = dict[str, float]

# Initial data required by the challenge.
menu: Menu = {
    "espresso": 7.0,
    "latte": 12.0,
    "cappuccino": 10.0,
}


def read_drink_name(prompt: str) -> str:
    """Ask for a drink name and return it trimmed and in lowercase.

    Menu keys are lowercase, so "Latte" and " latte " both find "latte".
    """
    return input(prompt).strip().lower()


def read_price(prompt: str) -> float | None:
    """Ask for a price and return it, or None when it is not usable.

    A price must be a real number and cannot be negative. Anything else
    prints "Invalid price." so the caller can stop without changing the menu.
    """
    try:
        price = float(input(prompt))
    except ValueError:
        print("Invalid price.")
        return None
    if not math.isfinite(price) or price < 0:
        print("Invalid price.")
        return None
    return price


def show_menu(menu_dict: Menu) -> None:
    """Print all drinks and prices."""
    if not menu_dict:
        print("The menu is empty.")
        return
    print("Current menu:")
    for drink, price in menu_dict.items():
        print(f"{drink} - {price}₪")


def add_item(menu_dict: Menu) -> None:
    """Add a new drink to the menu."""
    drink = read_drink_name("Enter new drink name: ")
    if not drink:
        print("Invalid name.")
        return
    price = read_price("Enter price: ")
    if price is None:
        return
    if drink in menu_dict:
        # An existing drink keeps its price: updating is a different action.
        print("Item already exists!")
        return
    menu_dict[drink] = price
    print(f'"{drink}" added!')


def update_price(menu_dict: Menu) -> None:
    """Change the price of an existing drink."""
    drink = read_drink_name("Which drink do you want to update? ")
    if drink not in menu_dict:
        print("Item not found.")
        return
    price = read_price("Enter the new price: ")
    if price is None:
        return
    menu_dict[drink] = price
    print("Price updated!")


def delete_item(menu_dict: Menu) -> None:
    """Remove a drink from the menu."""
    drink = read_drink_name("Which drink do you want to delete? ")
    if drink not in menu_dict:
        print("Item not found.")
        return
    del menu_dict[drink]
    print("Item deleted.")


def search_item(menu_dict: Menu) -> None:
    """Print the price of one drink, or say it is not in the menu."""
    drink = read_drink_name("Which drink are you looking for? ")
    if drink not in menu_dict:
        print("Not in the menu.")
        return
    print(f"{drink} - {menu_dict[drink]}₪")


def apply_discount(menu_dict: Menu, percent: float) -> None:
    """Reduce every price by a percentage, for example 10 for a 10% happy hour."""
    if not 0 <= percent <= 100:
        print("Invalid discount.")
        return
    for drink, price in menu_dict.items():
        menu_dict[drink] = round(price * (1 - percent / 100), 2)


def show_options() -> None:
    """Print the available actions."""
    print("What would you like to do?")
    print("1. Show menu")
    print("2. Add item")
    print("3. Update price")
    print("4. Delete item")
    print("5. Exit")
    print("6. Search item")


def run_coffee_shop(menu_dict: Menu | None = None) -> None:
    """Main loop of the program.

    Shows the options, reads one choice and calls the matching function until
    the user picks 5. Without an argument it works on the module's own menu.
    """
    active_menu = menu if menu_dict is None else menu_dict
    actions = {
        "1": show_menu,
        "2": add_item,
        "3": update_price,
        "4": delete_item,
        "6": search_item,
    }
    while True:
        show_options()
        choice = input("> ").strip()
        if choice == "5":
            print("Goodbye!")
            break
        action = actions.get(choice)
        if action is None:
            print("Invalid choice, try again.")
        else:
            action(active_menu)
        print()


if __name__ == "__main__":
    # Start the program only when this file is run, not when a test imports it.
    run_coffee_shop()
