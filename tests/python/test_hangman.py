import unittest
from _loader import find_one, load_package_module

source = find_one("Week*/**/Hangman/src/game.py").parent
mod = load_package_module("nova_hangman", source, "game")

class HangmanTests(unittest.TestCase):
    def test_hit_repeat_and_win(self):
        game = mod.HangmanGame("aba")
        self.assertEqual(game.guess("a"), "hit")
        self.assertEqual(game.guess("a"), "repeat")
        self.assertFalse(game.is_won())
        self.assertEqual(game.guess("b"), "hit")
        self.assertTrue(game.is_won())

    def test_miss_and_validation(self):
        game = mod.HangmanGame("python")
        self.assertEqual(game.guess("z"), "miss")
        self.assertEqual(game.wrong, 1)
        with self.assertRaises(ValueError):
            game.guess("12")

if __name__ == "__main__":
    unittest.main()
