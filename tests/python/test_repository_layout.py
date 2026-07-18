import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

class RepositoryLayoutTests(unittest.TestCase):
    def test_quality_infrastructure(self):
        self.assertTrue((ROOT / ".github/workflows/quality.yml").exists())
        self.assertTrue((ROOT / ".github/INTERNAL_GUIDE.md").exists())
        self.assertFalse(
            (ROOT / ".github/README.md").exists(),
            ".github/README.md can mask the root README on GitHub's repository page",
        )
        self.assertTrue((ROOT / "tools/nova_quality_gate.py").exists())
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        package_lock = json.loads((ROOT / "package-lock.json").read_text(encoding="utf-8"))
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
        self.assertRegex(package["version"], r"^\d+\.\d+\.\d+$")
        self.assertEqual(package_lock["version"], package["version"])
        self.assertEqual(package_lock["packages"][""]["version"], package["version"])
        self.assertIn(
            f"Repository presentation version <strong>{package['version']}</strong>",
            readme,
        )
        self.assertIn(f"## [{package['version']}]", changelog)
        for script in ("quality", "test:python", "test:js", "audit"):
            self.assertIn(script, package["scripts"])

    def test_no_week_archives(self):
        self.assertEqual(list(ROOT.glob("Week*.zip")), [])

    def test_every_curriculum_directory_has_readme(self):
        missing = []
        for week in (p for p in ROOT.iterdir() if p.is_dir() and p.name.lower().startswith("week")):
            for directory in [week, *[p for p in week.rglob("*") if p.is_dir()]]:
                if any(part in {"node_modules", "__pycache__", ".nova"} for part in directory.parts):
                    continue
                if any(directory.iterdir()) and not any(p.is_file() and p.name.lower() == "readme.md" for p in directory.iterdir()):
                    missing.append(str(directory.relative_to(ROOT)))
        self.assertEqual(missing, [], "Missing README.md: " + ", ".join(missing[:20]))

if __name__ == "__main__":
    unittest.main()
