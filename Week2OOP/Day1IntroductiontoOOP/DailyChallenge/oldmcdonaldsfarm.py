class Farm:
    SAME_PLURAL = {"sheep", "fish", "deer"}  # animals whose plural doesn't take an "s"

    def __init__(self, farm_name):
        self.name = farm_name
        self.animals = {}

    def add_animal(self, animal_type, count=1):
        self.animals[animal_type] = self.animals.get(animal_type, 0) + count

    def get_info(self):
        title = f"{self.name}'s farm"
        if not self.animals:
            return f"{title}\n\n    E-I-E-I-0!"
        w = max(len(a) for a in self.animals)  # column width
        lines = [f"{a:<{w}} : {self.animals[a]}" for a in self.animals]
        return f"{title}\n\n" + "\n".join(lines) + "\n\n    E-I-E-I-0!"

    def get_animal_types(self):
        return sorted(self.animals.keys())

    def get_short_info(self):
        types = self.get_animal_types()
        words = [
            t + ("s" if self.animals[t] > 1 and t not in self.SAME_PLURAL else "")
            for t in types
        ]
        if not words:
            return f"{self.name}'s farm has no animals."
        if len(words) == 1:
            list_part = words[0]
        elif len(words) == 2:
            list_part = f"{words[0]} and {words[1]}"
        else:
            list_part = ", ".join(words[:-1]) + f" and {words[-1]}"
        return f"{self.name}'s farm has {list_part}."


if __name__ == "__main__":
    # --- test ---
    macdonald = Farm("McDonald")
    macdonald.add_animal('cow', 5)
    macdonald.add_animal('sheep')
    macdonald.add_animal('sheep')
    macdonald.add_animal('goat', 12)

    print(macdonald.get_info())
    print()
    print(macdonald.get_short_info())
