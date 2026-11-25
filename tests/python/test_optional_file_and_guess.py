"""Regression checks for the optional file translator and argv guessing game."""
from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FOLDER = ROOT / "Week2OOP/Day4PythonFileIOJSONandAPI/Exercises"


def load_module(name, relative):
    spec = importlib.util.spec_from_file_location(name, FOLDER / relative)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


translator = load_module("optional_translator", "TranslatorUsingFiles/translator.py")
game = load_module("optional_guess", "SysGuessGame/guess_game.py")


class TranslatorTests(unittest.TestCase):
    def test_preserves_blank_lines_and_bounds_long_requests(self):
        calls = []
        def backend(text):
            calls.append(text)
            return "日本語"
        result = translator.translate_document("Hello\n\n" + "a" * 9100, backend)
        self.assertEqual(result, "日本語\n\n日本語日本語日本語")
        self.assertTrue(all(len(text) <= 4500 for text in calls))

    def test_new_utf8_output_and_original_source(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "input.txt"
            destination = Path(temp) / "output.txt"
            source.write_text("My own sample.", encoding="utf-8")
            translator.translate_file(source, destination, lambda text: "自分のサンプル。")
            self.assertEqual(destination.read_text(encoding="utf-8"), "自分のサンプル。")
            self.assertEqual(source.read_text(encoding="utf-8"), "My own sample.")

    def test_protects_existing_output_and_source(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "input.txt"
            output = Path(temp) / "output.txt"
            source.write_text("Keep source.", encoding="utf-8")
            output.write_text("Keep output.", encoding="utf-8")
            with self.assertRaises(FileExistsError):
                translator.translate_file(source, output, str.upper)
            with self.assertRaises(ValueError):
                translator.translate_file(source, source, str.upper)
            self.assertEqual(output.read_text(encoding="utf-8"), "Keep output.")

    def test_missing_file_and_provider_failure_do_not_create_output(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "input.txt"
            output = Path(temp) / "output.txt"
            with self.assertRaises(FileNotFoundError):
                translator.translate_file(source, output, str.upper)
            source.write_text("Public sample.", encoding="utf-8")
            def unavailable(text):
                raise RuntimeError("Provider unavailable")
            with self.assertRaises(RuntimeError):
                translator.translate_file(source, output, unavailable)
            self.assertFalse(output.exists())

    def test_empty_file_creates_empty_output_without_requests(self):
        with tempfile.TemporaryDirectory() as temp:
            source = Path(temp) / "input.txt"
            output = Path(temp) / "output.txt"
            source.write_text("", encoding="utf-8")
            def forbidden(text):
                self.fail("An empty file must not call the provider.")
            translator.translate_file(source, output, forbidden)
            self.assertEqual(output.read_text(encoding="utf-8"), "")


class GuessGameTests(unittest.TestCase):
    def test_default_and_custom_bounds(self):
        self.assertEqual(game.bounds([]), (1, 10))
        self.assertEqual(game.bounds(["-4", "2"]), (-4, 2))
        self.assertEqual(game.bounds(["7", "7"]), (7, 7))

    def test_bad_argument_ranges(self):
        for arguments in [["1"], ["1", "2", "3"], ["ten", "20"], ["5", "2"]]:
            with self.subTest(arguments=arguments), self.assertRaises(ValueError):
                game.bounds(arguments)

    def test_invalid_guesses_retry_until_inclusive_upper_bound(self):
        answers = iter(["word", "0", "11", "1", "10"])
        messages = []
        ranges = []
        def choose(start, end):
            ranges.append((start, end))
            return end
        attempts = game.play(1, 10, lambda prompt: next(answers), messages.append, choose)
        self.assertEqual(attempts, 2)
        self.assertEqual(ranges, [(1, 10)])
        self.assertEqual(len(messages), 5)

    def test_equal_bounds_and_lower_bound_can_be_won(self):
        self.assertEqual(game.play(3, 3, lambda prompt: "3", lambda message: None, lambda a, b: a), 1)
        self.assertEqual(game.play(-3, 2, lambda prompt: "-3", lambda message: None, lambda a, b: a), 1)


if __name__ == "__main__":
    unittest.main()
