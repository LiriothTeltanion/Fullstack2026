from __future__ import annotations

import io
import re
import unittest
from contextlib import redirect_stdout
from collections.abc import Callable, Iterable
from unittest import mock

from _loader import find_one, load_file


MODULE = load_file(
    "nova_week1_day1_exercises_xp",
    find_one(
        "Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/exercisesxp.py"
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


class Week1Day1ExercisesXPTests(unittest.TestCase):
    def test_exercise_1_prints_hello_world_four_times(self) -> None:
        self.assertEqual(capture_output(MODULE.exercise_1), ["Hello world"] * 4)

    def test_exercise_2_calculates_the_power_before_multiplication(self) -> None:
        self.assertEqual(capture_output(MODULE.exercise_2), ["7762392"])

    def test_exercise_3_reports_the_expected_comparison_results(self) -> None:
        self.assertEqual(
            capture_output(MODULE.exercise_3),
            ["False", "True", "False", "TypeError", "False"],
        )

    def test_exercise_4_uses_the_computer_brand_in_the_sentence(self) -> None:
        self.assertEqual(
            capture_output(MODULE.exercise_4),
            ["I have a ASUS computer."],
        )

    def test_exercise_5_includes_all_personal_information_fields(self) -> None:
        output = capture_output(MODULE.exercise_5)

        self.assertEqual(len(output), 1)
        self.assertRegex(
            output[0],
            re.compile(
                r"^My name is Kevin, I'm \d+ years old and my shoe size is \d+\.$"
            ),
        )

    def test_exercise_6_prints_only_when_a_is_greater_than_b(self) -> None:
        self.assertEqual(capture_output(MODULE.exercise_6), ["Hello World"])

    def test_exercise_7_classifies_positive_zero_and_negative_integers(self) -> None:
        cases = {
            "8": "Even",
            "7": "Odd",
            "0": "Even",
            "-3": "Odd",
        }

        for answer, expected in cases.items():
            with self.subTest(answer=answer):
                self.assertEqual(
                    capture_with_inputs(MODULE.exercise_7, [answer]),
                    [expected],
                )

    def test_read_int_retries_invalid_and_out_of_range_values(self) -> None:
        stream = io.StringIO()
        with mock.patch(
            "builtins.input", side_effect=["not-a-number", "-1", "301", "146"]
        ):
            with redirect_stdout(stream):
                result = MODULE.read_int("Height: ", min_val=0, max_val=300)

        self.assertEqual(result, 146)
        output = stream.getvalue()
        self.assertIn("Please enter a valid integer", output)
        self.assertIn("Value must be at least 0", output)
        self.assertIn("Value must be at most 300", output)

    def test_exercise_8_compares_names_case_insensitively(self) -> None:
        same_name = capture_with_inputs(MODULE.exercise_8, ["  kEvIn  "])
        different_name = capture_with_inputs(MODULE.exercise_8, ["Ada"])

        self.assertEqual(same_name, ["Hey, we have the same name! :)"])
        self.assertEqual(different_name, ["Nice to meet you, Ada!"])

    def test_exercise_9_requires_a_height_strictly_over_145_cm(self) -> None:
        cases = {
            "144": "need to grow 2cm",
            "145": "need to grow 1cm",
            "146": "tall enough to ride",
        }

        for answer, expected_fragment in cases.items():
            with self.subTest(answer=answer):
                output = capture_with_inputs(MODULE.exercise_9, [answer])
                self.assertEqual(len(output), 1)
                self.assertIn(expected_fragment, output[0])


if __name__ == "__main__":
    unittest.main()
