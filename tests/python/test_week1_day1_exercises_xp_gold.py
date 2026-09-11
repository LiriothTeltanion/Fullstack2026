from __future__ import annotations

import io
import unittest
from collections.abc import Callable, Iterable
from contextlib import redirect_stdout
from unittest import mock

from _loader import find_one, load_file


MODULE = load_file(
    "nova_week1_day1_exercises_xp_gold",
    find_one(
        "Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/"
        "exercisesxpgold.py"
    ),
)


def capture_output(function: Callable[[], None]) -> list[str]:
    """Run a no-argument function and return its printed output by line."""
    stream = io.StringIO()
    with redirect_stdout(stream):
        function()
    return stream.getvalue().splitlines()


def capture_with_inputs(
    function: Callable[[], None], answers: Iterable[str]
) -> list[str]:
    """Run an interactive function with deterministic answers."""
    stream = io.StringIO()
    with mock.patch("builtins.input", side_effect=list(answers)):
        with redirect_stdout(stream):
            function()
    return stream.getvalue().splitlines()


class Week1Day1ExercisesXPGoldTests(unittest.TestCase):
    def test_exercise_1_prints_the_exact_eight_lines(self) -> None:
        self.assertEqual(
            capture_output(MODULE.exercise_1_hello_world),
            ["Hello world"] * 4 + ["I love python"] * 4,
        )

    def test_get_season_maps_every_valid_month(self) -> None:
        expected = {
            1: "Winter",
            2: "Winter",
            3: "Spring",
            4: "Spring",
            5: "Spring",
            6: "Summer",
            7: "Summer",
            8: "Summer",
            9: "Autumn",
            10: "Autumn",
            11: "Autumn",
            12: "Winter",
        }

        for month, season in expected.items():
            with self.subTest(month=month):
                self.assertEqual(MODULE.get_season(month), season)

    def test_get_season_handles_each_transition_boundary(self) -> None:
        transitions = {
            2: "Winter",
            3: "Spring",
            5: "Spring",
            6: "Summer",
            8: "Summer",
            9: "Autumn",
            11: "Autumn",
            12: "Winter",
        }

        for month, season in transitions.items():
            with self.subTest(month=month):
                self.assertEqual(MODULE.get_season(month), season)

    def test_get_season_rejects_out_of_range_months(self) -> None:
        for month in (-1, 0, 13, 99):
            with self.subTest(month=month):
                with self.assertRaisesRegex(
                    ValueError, "month must be between 1 and 12"
                ):
                    MODULE.get_season(month)

    def test_get_valid_month_retries_invalid_answers(self) -> None:
        stream = io.StringIO()
        with mock.patch(
            "builtins.input", side_effect=["not-a-number", "0", "13", "4"]
        ):
            with redirect_stdout(stream):
                month = MODULE.get_valid_month()

        self.assertEqual(month, 4)
        self.assertEqual(
            stream.getvalue().splitlines(),
            [
                "Please enter a whole number.",
                "Month must be between 1 and 12.",
                "Month must be between 1 and 12.",
            ],
        )

    def test_exercise_2_prints_only_the_expected_season(self) -> None:
        self.assertEqual(
            capture_with_inputs(MODULE.exercise_2_season, ["7"]),
            ["Summer"],
        )


if __name__ == "__main__":
    unittest.main()
