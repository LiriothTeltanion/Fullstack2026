import unittest
from _loader import find_one, load_file

mod = load_file("nova_tictactoe", find_one("Week*/**/TicTacToe/tictactoe.py"))

class TicTacToeTests(unittest.TestCase):
    def test_new_board_and_move_parsing(self):
        board = mod.new_board()
        self.assertEqual(board, [[" "] * 3 for _ in range(3)])
        self.assertEqual(mod.parse_move("2 3"), (1, 2))
        self.assertEqual(mod.validate_move(board, "1 1"), (0, 0))

    def test_rows_columns_diagonals_and_tie(self):
        self.assertTrue(mod.check_win([["X", "X", "X"], [" "] * 3, [" "] * 3], "X"))
        self.assertTrue(mod.check_win([["O", "X", "X"], ["O", "X", "X"], ["O", " ", " "]], "O"))
        self.assertTrue(mod.check_win([["X", "O", "O"], ["O", "X", "X"], ["O", "O", "X"]], "X"))
        self.assertTrue(mod.is_tie([["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]]))

    def test_invalid_move(self):
        with self.assertRaises(ValueError):
            mod.parse_move("one")
        board = mod.new_board()
        board[0][0] = "X"
        with self.assertRaises(ValueError):
            mod.validate_move(board, "1 1")

if __name__ == "__main__":
    unittest.main()
