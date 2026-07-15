"""
File: exercisesxpgold.py
Purpose: Single-file solutions for "Exercises XP Gold" — Classes & Objects. 🧠🐍
Author: Kevin "Lirioth" Cusnir
Date: 2025-10-09 | TZ: Asia/Jerusalem

Content:
  • Circle class (perimeter/area + definition) ⭕
  • MyList class (reverse/sort + bonus randoms) 🔤🎲
  • MenuManager class (add/update/remove/print) 🍽️

Notes:
  - Comments are in ENGLISH as requested.
  - Minimal standard library only.
  - Run this file directly to see demos (under __main__). ✅
"""

from __future__ import annotations

from math import pi
from random import randint
from typing import Any, Dict, List, Optional


# ==============================
# Exercise 1 — Geometry (Circle)
# ==============================
class Circle:
    """A simple circle model.

    Stores a positive radius and can compute its perimeter and area.
    Also prints a short geometrical definition.

    Args:
        radius: The circle radius (must be > 0).

    Raises:
        ValueError: If radius <= 0.
    """

    def __init__(self, radius: float = 1.0) -> None:
        if radius <= 0:
            raise ValueError("Radius must be positive (> 0).")
        self.radius: float = float(radius)

    def perimeter(self) -> float:
        """Compute the circumference (perimeter) of the circle: 2 * pi * r."""
        return 2 * pi * self.radius

    def area(self) -> float:
        """Compute the area of the circle: pi * r^2."""
        return pi * (self.radius ** 2)

    def describe(self) -> None:
        """Print a short geometrical definition of a circle."""
        print("A circle is the set of all points at a constant distance (the radius) from a center.")

    def __repr__(self) -> str:
        return f"Circle(radius={self.radius})"


# =====================================
# Exercise 2 — Custom List Class (MyList)
# =====================================
class MyList:
    """A thin wrapper around a list of letters with convenience methods.

    Args:
        letters: A list of strings (e.g., letters). The class stores a copy.

    Raises:
        ValueError: If `letters` is not a list of strings.
    """

    def __init__(self, letters: List[str]) -> None:
        if not isinstance(letters, list) or not all(isinstance(x, str) for x in letters):
            raise ValueError("letters must be a list of strings.")
        self._letters: List[str] = letters.copy()

    def reversed_list(self) -> List[str]:
        """Return a new list with the letters in reverse order."""
        return list(reversed(self._letters))

    def sorted_list(self) -> List[str]:
        """Return a new list with the letters sorted alphabetically (case-insensitive)."""
        return sorted(self._letters, key=str.lower)

    def random_numbers_like(self, low: int = 0, high: int = 100) -> List[int]:
        """Bonus 🎁: Generate random integers with the same length as the letters list."""
        if low > high:
            low, high = high, low
        return [randint(low, high) for _ in range(len(self._letters))]

    def __repr__(self) -> str:
        return f"MyList(letters={self._letters!r})"


# =========================================
# Exercise 3 — Restaurant Menu Manager (OOP)
# =========================================
class MenuManager:
    """Manage a restaurant menu stored as a list of dictionaries.

    Each dish is a dict with keys:
      - name   (str)
      - price  (float)
      - spice  (str in {'A','B','C'})
      - gluten (bool)
    """

    def __init__(self) -> None:
        self.menu: List[Dict[str, Any]] = [
            {"name": "Soup", "price": 10.0, "spice": "B", "gluten": False},
            {"name": "Hamburger", "price": 15.0, "spice": "A", "gluten": True},
            {"name": "Salad", "price": 18.0, "spice": "A", "gluten": False},
            {"name": "French Fries", "price": 5.0, "spice": "C", "gluten": False},
            {"name": "Beef bourguignon", "price": 25.0, "spice": "B", "gluten": True},
        ]

    def add_item(self, name: str, price: float, spice: str, gluten: bool) -> None:
        """Add a new dish to the menu. If it exists, suggest update instead. 🌟"""
        self._validate_spice(spice)
        if self._find_index(name) is not None:
            print(f"Dish '{name}' already exists. Use update_item instead ⚠️")
            return
        self.menu.append({"name": name, "price": float(price), "spice": spice, "gluten": bool(gluten)})
        print(f"Dish '{name}' added ✅")

    def update_item(self, name: str, price: float, spice: str, gluten: bool) -> None:
        """Update an existing dish by name; warn nicely if not found."""
        self._validate_spice(spice)
        idx = self._find_index(name)
        if idx is None:
            print(f"Dish '{name}' not found; cannot update ❌")
            return
        self.menu[idx] = {"name": name, "price": float(price), "spice": spice, "gluten": bool(gluten)}
        print(f"Dish '{name}' updated ✅")

    def remove_item(self, name: str) -> None:
        """Remove a dish by name. If found, print the updated menu as requested."""
        idx = self._find_index(name)
        if idx is None:
            print(f"Dish '{name}' not found; nothing removed ❌")
            return
        self.menu.pop(idx)
        print(f"Dish '{name}' removed ✅")
        self.print_menu()

    def print_menu(self) -> None:
        """Pretty-print the current menu in a compact format."""
        print(f"Current menu ({len(self.menu)} items):")
        for item in self.menu:
            price_display = int(item["price"]) if float(item["price"]).is_integer() else item["price"]
            print(f"- {item['name']} | ₪{price_display} | spice={item['spice']} | gluten={item['gluten']}")

    def _find_index(self, name: str) -> Optional[int]:
        """Return the list index of a dish by case-insensitive name; None if missing."""
        name_lower = name.strip().lower()
        for i, item in enumerate(self.menu):
            if item["name"].strip().lower() == name_lower:
                return i
        return None

    def _validate_spice(self, spice: str) -> None:
        """Ensure spice ∈ {'A','B','C'} where A=not, B=little, C=very spicy."""
        if spice not in {"A", "B", "C"}:
            raise ValueError("Spice must be one of 'A' (not spicy), 'B' (a little spicy), 'C' (very spicy).")


if __name__ == "__main__":
    print(">>> Circle demo ⭕")
    c = Circle(3)
    print("Perimeter:", round(c.perimeter(), 2))
    print("Area:", round(c.area(), 2))
    c.describe()

    print("\n>>> MyList demo 🔤")
    ml = MyList(["b", "A", "c"])
    print("Reversed:", ml.reversed_list())
    print("Sorted:", ml.sorted_list())
    print("Randoms:", ml.random_numbers_like(10, 15))

    print("\n>>> MenuManager demo 🍽️")
    mm = MenuManager()
    mm.print_menu()
    mm.add_item("Falafel", 12, "A", False)
    mm.update_item("Soup", 11, "B", False)
    mm.remove_item("Hamburger")
