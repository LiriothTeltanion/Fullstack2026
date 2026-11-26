import subprocess
import sys
import unittest

from _loader import find_one


SCRIPT = find_one("Week*/**/DailyChallenge/AdvancedAlgorithm/main.py")


def run_cli(*args):
    return subprocess.run(
        [sys.executable, "-B", str(SCRIPT), *args],
        capture_output=True,
        text=True,
        timeout=10,
    )


class AdvancedAlgorithmCliTests(unittest.TestCase):
    def test_summary_only_preserves_matches_in_both_algorithms(self):
        for algorithm in ("hash", "two-pointer"):
            with self.subTest(algorithm=algorithm):
                result = run_cli("--algo", algorithm, "--n", "4", "--low", "2",
                                 "--high", "2", "--target", "4", "--sample", "0")
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn("Unique value pairs found: 1", result.stdout)
                self.assertNotIn("Sample pairs:", result.stdout)
                self.assertNotIn("No pairs found.", result.stdout)
                if algorithm == "hash":
                    self.assertIn("Total index-pairs (with multiplicities): 6", result.stdout)

    def test_empty_dataset_reports_no_matches(self):
        result = run_cli("--n", "0", "--sample", "0")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("No pairs found.", result.stdout)

    def test_invalid_dataset_arguments_use_cli_errors(self):
        for args, option in [(("--n", "-1"), "--n"), (("--low", "3", "--high", "2"), "--low")]:
            with self.subTest(args=args):
                result = run_cli(*args)
                self.assertEqual(result.returncode, 2)
                self.assertIn("error:", result.stderr)
                self.assertIn(option, result.stderr.split("error:", 1)[1])
                self.assertNotIn("Traceback", result.stderr)
