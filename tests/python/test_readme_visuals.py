import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class ReadmeVisualTests(unittest.TestCase):
    def test_public_readme_visual_contract(self):
        result = subprocess.run(
            [sys.executable, "-B", "tools/validate_readme_visuals.py", "--repo", "."],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        self.assertEqual(result.returncode, 0, output)


if __name__ == "__main__":
    unittest.main()
