import json
import subprocess
import sys
import unittest
from pathlib import Path

from _loader import load_file

ROOT = Path(__file__).resolve().parents[2]
CANONICAL_WEEK_ROOTS = (
    "Week1Python",
    "Week2OOP",
    "Week3JavaScriptandDOM",
    "Week4AdvAsynchronousJavaScript",
    "Week5MiniProjectAndTypeScript",
    "Week6DatabasesAndNodejs",
    "Week7NodejsAndReact",
    "Week8React",
    "Week9Redux",
    "Week10AdvancedTypeScriptAndAuthentication",
    "Week11FinalProject",
    "Week12FinalProject",
)
STRUCTURE_VALIDATOR = load_file(
    "fullstack2026_structure_validator",
    ROOT / "tools/validate_repository_structure.py",
)


class RepositoryLayoutTests(unittest.TestCase):
    def test_quality_infrastructure(self):
        self.assertTrue((ROOT / ".github/workflows/quality.yml").exists())
        self.assertTrue((ROOT / ".github/INTERNAL_GUIDE.md").exists())
        self.assertTrue((ROOT / ".github/copilot-instructions.md").exists())
        self.assertTrue((ROOT / ".github/pull_request_template.md").exists())
        self.assertTrue((ROOT / "CONTRIBUTING.md").exists())
        self.assertFalse(
            (ROOT / ".github/README.md").exists(),
            ".github/README.md can mask the root README on GitHub's repository page",
        )
        self.assertTrue((ROOT / "tools/nova_quality_gate.py").exists())
        self.assertTrue((ROOT / "tools/validate_display_titles.py").exists())
        self.assertTrue((ROOT / ".learning/display-map.json").exists())
        self.assertTrue((ROOT / ".learning/OCTOPUS_INTAKE.md").exists())
        self.assertTrue((ROOT / ".learning/intake/README.md").exists())
        self.assertTrue((ROOT / ".learning/intake/queue.json").exists())
        self.assertTrue((ROOT / ".learning/intake/exercise-intake.schema.json").exists())
        self.assertTrue((ROOT / "tools/learning_intake.py").exists())
        self.assertTrue((ROOT / "eslint.config.js").exists())
        self.assertFalse((ROOT / ".eslintrc.cjs").exists())
        self.assertFalse((ROOT / ".eslintignore").exists())
        for privacy_aware_tool in (
            ROOT / "tools/nova_quality_gate.py",
            ROOT / "tools/nova_ultimate.py",
        ):
            self.assertIn(
                '".private"',
                privacy_aware_tool.read_text(encoding="utf-8"),
                f"{privacy_aware_tool.name} must never scan authenticated intake data",
            )
        package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
        package_lock = json.loads((ROOT / "package-lock.json").read_text(encoding="utf-8"))
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
        self.assertRegex(package["version"], r"^\d+\.\d+\.\d+$")
        self.assertEqual(package_lock["version"], package["version"])
        lock_root = package_lock["packages"][""]
        self.assertEqual(lock_root["engines"], package["engines"])
        self.assertEqual(lock_root["devDependencies"], package["devDependencies"])
        self.assertEqual(package_lock["packages"][""]["version"], package["version"])
        self.assertIn(
            f"Repository presentation version <strong>{package['version']}</strong>",
            readme,
        )
        self.assertIn(f"## [{package['version']}]", changelog)
        for script in (
            "quality",
            "catalogs:refresh",
            "catalogs:check",
            "verify:visuals",
            "verify:titles",
            "verify:structure",
            "test:python",
            "test:js",
            "audit",
            "intake",
            "intake:check",
            "lint:baseline",
            "typecheck:anchor",
        ):
            self.assertIn(script, package["scripts"])
        for dependency in (
            "@eslint/js",
            "@types/node",
            "eslint",
            "eslint-config-prettier",
            "globals",
            "typescript",
            "typescript-eslint",
        ):
            self.assertIn(dependency, package["devDependencies"])
        self.assertNotIn(
            "@typescript-eslint/eslint-plugin", package["devDependencies"]
        )
        self.assertNotIn("@typescript-eslint/parser", package["devDependencies"])
        workflow = (ROOT / ".github/workflows/quality.yml").read_text(
            encoding="utf-8"
        )
        self.assertIn("npm run verify:structure", workflow)
        self.assertIn("npm ci --ignore-scripts", workflow)
        self.assertIn("npm audit --audit-level=high", workflow)
        self.assertIn("npm run lint:baseline", workflow)
        self.assertIn("npm run typecheck:anchor", workflow)

    def test_github_desktop_commit_guidance(self):
        instructions = (ROOT / ".github/copilot-instructions.md").read_text(
            encoding="utf-8"
        )
        contributing = (ROOT / "CONTRIBUTING.md").read_text(encoding="utf-8")
        for required_text in (
            "Kevin Cusnir",
            "Lirioth Teltanion",
            "What changed",
            "Why",
            "Verification",
            "Known limitations",
            "type(scope): emoji imperative summary",
            "Creative-Signature: Lirioth Teltanion",
        ):
            self.assertIn(required_text, instructions)
        self.assertIn("GitHub Desktop", contributing)
        self.assertIn("Publish branch", contributing)
        self.assertIn("Asia/Jerusalem", contributing)

    def test_canonical_repository_structure(self):
        result = subprocess.run(
            [sys.executable, "-B", "tools/validate_repository_structure.py", "--repo", "."],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=60,
        )
        output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        self.assertEqual(result.returncode, 0, output)

    def test_structure_catalogs_are_current(self):
        result = subprocess.run(
            [
                sys.executable,
                "-B",
                "tools/refresh_structure_catalogs.py",
                "--repo",
                ".",
                "--check",
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
            timeout=60,
        )
        output = "\n".join(part for part in (result.stdout, result.stderr) if part)
        self.assertEqual(result.returncode, 0, output)

    def test_secret_assignment_rule_distinguishes_credentials_from_storage_keys(self):
        dummy_value = "a" * 32
        credential = STRUCTURE_VALIDATOR.SECRET_ASSIGNMENT_RE.search(
            f'const GIPHY_KEY = "{dummy_value}";'
        )
        storage_key = STRUCTURE_VALIDATOR.SECRET_ASSIGNMENT_RE.search(
            f'const HS_KEY = "{dummy_value}";'
        )
        camel_case_name = "".join(("api", "Key"))
        camel_case_property = STRUCTURE_VALIDATOR.SECRET_ASSIGNMENT_RE.search(
            f'{camel_case_name}: "{dummy_value}",'
        )
        self.assertIsNotNone(credential)
        self.assertIsNotNone(camel_case_property)
        self.assertFalse(STRUCTURE_VALIDATOR.is_placeholder_secret(credential.group(1)))
        self.assertFalse(
            STRUCTURE_VALIDATOR.is_placeholder_secret(camel_case_property.group(1))
        )
        self.assertIsNone(storage_key)
        self.assertTrue(STRUCTURE_VALIDATOR.is_placeholder_secret("YOUR_GIPHY_API_KEY"))

    def test_no_week_archives(self):
        self.assertEqual(list(ROOT.glob("Week*.zip")), [])

    def test_exact_twelve_week_roots_use_numeric_order(self):
        roots = sorted(
            (path.name for path in ROOT.iterdir() if path.is_dir() and path.name.startswith("Week")),
            key=STRUCTURE_VALIDATOR.week_sort_key,
        )
        self.assertEqual(roots, list(CANONICAL_WEEK_ROOTS))
        self.assertEqual(
            sorted(("Week10Example", "Week2Example"), key=STRUCTURE_VALIDATOR.week_sort_key),
            ["Week2Example", "Week10Example"],
        )

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
