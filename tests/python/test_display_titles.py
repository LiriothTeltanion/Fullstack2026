import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class DisplayTitleTests(unittest.TestCase):
    def test_display_title_contract(self):
        result = subprocess.run(
            [sys.executable, "-B", "tools/validate_display_titles.py", "--repo", "."],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=60,
        )
        output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        self.assertEqual(result.returncode, 0, output)


if __name__ == "__main__":
    unittest.main()
