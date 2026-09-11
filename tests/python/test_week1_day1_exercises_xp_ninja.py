from __future__ import annotations

import io
import unittest
from collections.abc import Callable, Iterable
from contextlib import redirect_stdout
from unittest import mock

from _loader import find_one, load_file


MODULE = load_file(
    "nova_week1_day1_exercises_xp_ninja",
    find_one(
        "Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/"
        "exercisesxpninja.py"
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


class Week1Day1ExercisesXPNinjaTests(unittest.TestCase):
    def test_exercise_1_explains_path_command_discovery(self) -> None:
        output = capture_output(MODULE.exercise_1_path_explanation)

        self.assertEqual(len(output), 3)
        self.assertIn("'python' on Windows", output[0])
        self.assertIn("PATH lists directories", output[1])
        self.assertIn("from any directory", output[2])

    def test_exercise_2_identifies_py_as_the_windows_launcher(self) -> None:
        self.assertEqual(
            capture_output(MODULE.exercise_2_python_launcher),
            [
                "Run 'py' on Windows to open Python with the Python Launcher.",
                "The Windows 'py' command is a launcher, not a PowerShell alias.",
            ],
        )

    def test_exercise_3_prints_all_predicted_results(self) -> None:
        self.assertEqual(
            capture_output(MODULE.exercise_3_outputs),
            [
                "True",
                "True",
                "False",
                "False",
                "True",
                "False",
                "x is True",
                "y is False",
                "a: 5",
                "b: 10",
            ],
        )

    def test_exercise_4_counts_every_character_in_the_supplied_text(self) -> None:
        self.assertEqual(capture_output(MODULE.exercise_4_text_length), ["445"])

    def test_contains_letter_a_is_case_insensitive(self) -> None:
        self.assertTrue(MODULE.contains_letter_a("A"))
        self.assertTrue(MODULE.contains_letter_a("a"))
        self.assertFalse(MODULE.contains_letter_a("Hello, Kevin!"))

    def test_exercise_5_congratulates_only_for_a_new_valid_record(self) -> None:
        output = capture_with_inputs(
            MODULE.exercise_5_longest_without_a,
            ["Hello", "World", "Tiny", "Banana", "Hello Kevin", ""],
        )

        self.assertEqual(
            output,
            [
                "Enter sentences without the letter A. Press Enter to finish.",
                "Congratulations! New longest sentence: 5 characters.",
                "That sentence contains the letter A. Try again.",
                "Congratulations! New longest sentence: 11 characters.",
                "Longest valid sentence: Hello Kevin",
            ],
        )

    def test_exercise_5_handles_finishing_without_a_valid_sentence(self) -> None:
        self.assertEqual(
            capture_with_inputs(MODULE.exercise_5_longest_without_a, [""]),
            [
                "Enter sentences without the letter A. Press Enter to finish.",
                "No valid sentence was recorded.",
            ],
        )


if __name__ == "__main__":
    unittest.main()
