"""Remote Exercise: Extending List.

Two classes that inherit from Python's built-in list.
"""


class TypedList(list):
    """A list that only accepts items of one type."""

    def __init__(self, item_type, items=()):
        super().__init__()
        self.item_type = item_type
        self.extend(items)

    def _check(self, item):
        if not isinstance(item, self.item_type):
            raise TypeError(f"{item!r} is not a {self.item_type.__name__}")

    def append(self, item):
        self._check(item)
        super().append(item)

    def insert(self, index, item):
        self._check(item)
        super().insert(index, item)

    def extend(self, items):
        for item in items:
            self.append(item)

    def __repr__(self):
        return f"{type(self).__name__}({self.item_type.__name__}, {list(self)})"


class NumberList(TypedList):
    """A TypedList of numbers with a few statistics methods."""

    def __init__(self, items=()):
        super().__init__((int, float), items)

    def _check(self, item):
        # bool is a subclass of int, but True is not a number I want here.
        if isinstance(item, bool) or not isinstance(item, (int, float)):
            raise TypeError(f"{item!r} is not a number")

    def total(self):
        return sum(self)

    def average(self):
        if not self:
            raise ValueError("cannot average an empty list")
        return self.total() / len(self)

    def normalized(self):
        """Return a new NumberList scaled so the biggest value becomes 1."""
        biggest = max(self)
        return NumberList(round(value / biggest, 2) for value in self)

    def __repr__(self):
        return f"NumberList({list(self)})"
