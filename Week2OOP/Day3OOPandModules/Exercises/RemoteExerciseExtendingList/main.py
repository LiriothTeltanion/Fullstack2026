"""Try out the classes from extended_list.py (imported as a module)."""

from extended_list import NumberList, TypedList


def main():
    names = TypedList(str, ["Ana", "Ben"])
    names.append("Carla")
    names.insert(0, "Zoe")
    print(names)
    print("Still a real list:", isinstance(names, list), "| sorted:", sorted(names))

    try:
        names.append(42)
    except TypeError as error:
        print("Rejected:", error)

    scores = NumberList([70, 85.5, 92])
    scores.append(64)
    print(scores)
    print("Total:", scores.total())
    print("Average:", round(scores.average(), 2))
    print("Normalized:", scores.normalized())

    try:
        scores.extend([100, True])
    except TypeError as error:
        print("Rejected:", error)
    print("After the failed extend:", scores)


if __name__ == "__main__":
    main()
