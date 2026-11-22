import io
import unittest
from collections.abc import Callable
from contextlib import redirect_stdout
from unittest import mock

from _loader import find_one, load_file


MODULE = load_file(
    "nova_week1_day4_coffee_shop_menu_manager",
    find_one(
        "Week1Python/Day4Functions/DailyChallenge/CoffeeShopMenuManager/"
        "coffeeshopmenumanager.py"
    ),
)

OPTIONS = [
    "What would you like to do?",
    "1. Show menu",
    "2. Add item",
    "3. Update price",
    "4. Delete item",
    "5. Exit",
    "6. Search item",
]


def starting_menu() -> dict[str, float]:
    """Return a fresh copy of the menu every test starts from."""
    return {"espresso": 7.0, "latte": 12.0, "cappuccino": 10.0}


def run_with_inputs(function: Callable[[], None], answers: list[str]) -> list[str]:
    """Run a function with scripted keyboard answers and return its printed lines."""
    stream = io.StringIO()
    with mock.patch("builtins.input", side_effect=answers), redirect_stdout(stream):
        function()
    return stream.getvalue().splitlines()


class Week1Day4CoffeeShopMenuManagerTests(unittest.TestCase):
    """Protect prompt-aligned behavior without claiming learning or submission."""

    def test_module_starts_with_the_required_menu(self) -> None:
        self.assertEqual(MODULE.menu, starting_menu())

    def test_show_menu_prints_every_drink_with_its_price(self) -> None:
        lines = run_with_inputs(lambda: MODULE.show_menu(starting_menu()), [])
        self.assertEqual(
            lines,
            ["Current menu:", "espresso - 7.0₪", "latte - 12.0₪", "cappuccino - 10.0₪"],
        )

    def test_show_menu_reports_an_empty_menu(self) -> None:
        self.assertEqual(
            run_with_inputs(lambda: MODULE.show_menu({}), []), ["The menu is empty."]
        )

    def test_add_item_stores_the_price_as_a_float(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.add_item(menu), ["mocha", "14"])
        self.assertEqual(lines, ['"mocha" added!'])
        self.assertEqual(menu["mocha"], 14.0)
        self.assertIsInstance(menu["mocha"], float)

    def test_add_item_keeps_the_price_of_an_existing_drink(self) -> None:
        menu = starting_menu()
        # Only the name is asked: an existing drink never reaches the price question.
        lines = run_with_inputs(lambda: MODULE.add_item(menu), ["Latte"])
        self.assertEqual(lines, ["Item already exists!"])
        self.assertEqual(menu, starting_menu())

    def test_add_item_rejects_a_negative_or_non_numeric_price(self) -> None:
        for answer in ("-5", "abc", "nan"):
            with self.subTest(price=answer):
                menu = starting_menu()
                lines = run_with_inputs(lambda: MODULE.add_item(menu), ["mocha", answer])
                self.assertEqual(lines, ["Invalid price."])
                self.assertEqual(menu, starting_menu())

    def test_update_price_changes_an_existing_drink(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.update_price(menu), ["latte", "13"])
        self.assertEqual(lines, ["Price updated!"])
        self.assertEqual(menu["latte"], 13.0)

    def test_update_price_reports_an_unknown_drink(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.update_price(menu), ["tea"])
        self.assertEqual(lines, ["Item not found."])
        self.assertEqual(menu, starting_menu())

    def test_update_price_rejects_a_negative_price(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.update_price(menu), ["latte", "-5"])
        self.assertEqual(lines, ["Invalid price."])
        self.assertEqual(menu, starting_menu())

    def test_delete_item_removes_an_existing_drink(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.delete_item(menu), ["espresso"])
        self.assertEqual(lines, ["Item deleted."])
        self.assertNotIn("espresso", menu)
        self.assertEqual(len(menu), 2)

    def test_delete_item_reports_an_unknown_drink(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.delete_item(menu), ["tea"])
        self.assertEqual(lines, ["Item not found."])
        self.assertEqual(menu, starting_menu())

    def test_show_options_lists_every_action(self) -> None:
        self.assertEqual(run_with_inputs(MODULE.show_options, []), OPTIONS)

    def test_search_item_prints_the_price_or_says_it_is_missing(self) -> None:
        menu = starting_menu()
        self.assertEqual(
            run_with_inputs(lambda: MODULE.search_item(menu), ["latte"]), ["latte - 12.0₪"]
        )
        self.assertEqual(
            run_with_inputs(lambda: MODULE.search_item(menu), ["tea"]), ["Not in the menu."]
        )

    def test_apply_discount_reduces_every_price(self) -> None:
        menu = starting_menu()
        MODULE.apply_discount(menu, 10)
        self.assertEqual(menu, {"espresso": 6.3, "latte": 10.8, "cappuccino": 9.0})

    def test_apply_discount_rejects_a_percentage_outside_0_to_100(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.apply_discount(menu, 150), [])
        self.assertEqual(lines, ["Invalid discount."])
        self.assertEqual(menu, starting_menu())

    def test_run_coffee_shop_follows_the_example_session(self) -> None:
        menu = starting_menu()
        answers = ["1", "2", "mocha", "14", "3", "latte", "13", "4", "espresso", "1", "5"]
        lines = run_with_inputs(lambda: MODULE.run_coffee_shop(menu), answers)

        # The order of the final menu is the order the example session shows.
        self.assertEqual(list(menu.items()), [("latte", 13.0), ("cappuccino", 10.0), ("mocha", 14.0)])
        self.assertEqual(lines[-1], "Goodbye!")
        self.assertEqual(lines.count("What would you like to do?"), 6)
        for expected in ('"mocha" added!', "Price updated!", "Item deleted.", "mocha - 14.0₪"):
            self.assertIn(expected, lines)

    def test_run_coffee_shop_reports_an_invalid_choice_and_keeps_running(self) -> None:
        menu = starting_menu()
        lines = run_with_inputs(lambda: MODULE.run_coffee_shop(menu), ["9", "", "5"])
        self.assertEqual(lines.count("Invalid choice, try again."), 2)
        self.assertEqual(lines[-1], "Goodbye!")
        self.assertEqual(menu, starting_menu())

    def test_run_coffee_shop_uses_the_module_menu_by_default(self) -> None:
        original = dict(MODULE.menu)
        try:
            run_with_inputs(MODULE.run_coffee_shop, ["2", "mocha", "14", "5"])
            self.assertEqual(MODULE.menu["mocha"], 14.0)
        finally:
            MODULE.menu.clear()
            MODULE.menu.update(original)


if __name__ == "__main__":
    unittest.main()
