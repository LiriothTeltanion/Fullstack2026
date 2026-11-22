# ☕ Daily Challenge - Coffee Shop Menu Manager

A small console program that manages a coffee shop menu: show it, add a drink, change a price, delete a drink and exit. The point of the exercise is organisation: every action is its own function and the main loop only decides which one to call.

## 🚀 Run

```bash
python Week1Python/Day4Functions/DailyChallenge/CoffeeShopMenuManager/coffeeshopmenumanager.py
```

## 🧱 How it is built

The menu is a dictionary where the key is the drink name and the value is its price as a float.

| Function | What it does |
|---|---|
| `show_menu(menu_dict)` | Prints every drink with its price, or says the menu is empty. |
| `add_item(menu_dict)` | Asks for a name and a price and adds the drink. An existing drink keeps its price. |
| `update_price(menu_dict)` | Changes the price of a drink that exists. |
| `delete_item(menu_dict)` | Removes a drink that exists. |
| `show_options()` | Prints the list of actions. |
| `run_coffee_shop()` | The controller: shows the options, reads a choice and calls the matching function until the user exits. |

Two small helpers keep the action functions short: `read_drink_name()` trims and lowercases what the user types, and `read_price()` returns a usable price or `None`.

### Extras

- **Price validation:** a negative price or a text that is not a number prints `Invalid price.` and changes nothing.
- **Search:** `search_item(menu_dict)` prints one drink's price and is option 6 in the menu.
- **Discount:** `apply_discount(menu_dict, percent)` reduces every price by a percentage.

## 💡 Decisions worth explaining

- **The functions change the dictionary they receive.** A dictionary is mutable, so `add_item(menu)` edits the same object the caller holds. That is why the functions return nothing.
- **The loop dispatches through a dictionary of functions** (`"1": show_menu`, and so on) instead of a long `if / elif` chain. Adding option 6 was one new line.
- **The program starts behind `if __name__ == "__main__":`.** Importing the file from a test does not start the interactive loop.
- **Names are compared in lowercase**, so `Latte` finds `latte`.

## 🧪 Tests

```bash
python -m unittest discover -s tests/python -p "test_week1_day4*" -v
```

`tests/python/test_week1_day4_coffee_shop_menu_manager.py` scripts the keyboard answers and checks the printed lines and the resulting menu: each action, the invalid cases, the extras and one complete session.

## 📌 Status

Local behavior is covered by the tests above. Octopus submission, checker response and instructor review are recorded separately and are not claimed here.
