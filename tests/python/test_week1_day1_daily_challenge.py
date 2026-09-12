from __future__ import annotations

import io
import unittest
from collections.abc import Callable
from contextlib import redirect_stdout
from unittest import mock

from _loader import find_one, load_file


MODULE = load_file(
    "nova_week1_day1_daily_challenge",
    find_one(
        "Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/"
        "buildupastring.py"
    ),
)


def capture_output(function: Callable[[], None]) -> list[str]:
    """Run a no-argument function and return its printed output by line."""
    stream = io.StringIO()
    with redirect_stdout(stream):
        function()
    return stream.getvalue().splitlines()


class Week1Day1DailyChallengeLocalTests(unittest.TestCase):
    """Protect prompt-aligned behavior without claiming learning or submission."""

    def test_validate_length_covers_short_exact_and_long_inputs(self) -> None:
        self.assertEqual(
            MODULE.validate_length("123456789"),
            (False, "String not long enough."),
        )
        self.assertEqual(
            MODULE.validate_length("0123456789"),
            (True, "Perfect string"),
        )
        self.assertEqual(
            MODULE.validate_length("01234567890"),
            (False, "String too long."),
        )

    def test_build_up_text_prints_one_additional_character_per_line(self) -> None:
        self.assertEqual(
            capture_output(lambda: MODULE.build_up_text("code")),
            ["c", "co", "cod", "code"],
        )

    def test_jumble_text_preserves_every_character(self) -> None:
        original = "aabbccddee"
        jumbled = MODULE.jumble_text(original)

        self.assertEqual(len(jumbled), len(original))
        self.assertEqual(sorted(jumbled), sorted(original))
        self.assertEqual(original, "aabbccddee")

    def test_main_stops_after_an_invalid_length(self) -> None:
        with mock.patch("builtins.input", return_value="short"):
            self.assertEqual(
                capture_output(MODULE.main),
                ["String not long enough."],
            )

    def test_main_runs_the_complete_local_flow_for_ten_characters(self) -> None:
        with (
            mock.patch("builtins.input", return_value="0123456789"),
            mock.patch.object(MODULE, "jumble_text", return_value="9876543210"),
        ):
            output = capture_output(MODULE.main)

        self.assertEqual(
            output,
            [
                "Perfect string",
                "First character: 0",
                "Last character: 9",
                "0",
                "01",
                "012",
                "0123",
                "01234",
                "012345",
                "0123456",
                "01234567",
                "012345678",
                "0123456789",
                "Jumbled string: 9876543210",
            ],
        )


if __name__ == "__main__":
    unittest.main()
