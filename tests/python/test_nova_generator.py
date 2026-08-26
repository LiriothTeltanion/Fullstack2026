import importlib.util
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "nova_ultimate_generator_test", ROOT / "tools/nova_ultimate.py"
)
assert SPEC is not None and SPEC.loader is not None
NOVA = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = NOVA
SPEC.loader.exec_module(NOVA)


class NovaGeneratorTests(unittest.TestCase):
    def test_eslint_migration_defaults_and_ci_stay_in_sync(self):
        with tempfile.TemporaryDirectory(prefix="nova-generator-test-") as raw:
            target = Path(raw)
            changes = []

            NOVA.install_tool_files(target, ROOT / "tools", changes)
            NOVA.install_eslint_config(target, ROOT / "tools", changes)

            typecheck_config = (
                target
                / "Week5MiniProjectAndTypeScript"
                / "Day2IntroductionToTypeScriptAndKeyConcepts"
                / "DailyChallenge"
                / "UnionTypeValidator"
                / "tsconfig.json"
            )
            typecheck_config.parent.mkdir(parents=True)
            typecheck_config.write_text("{}\n", encoding="utf-8")
            (target / "package.json").write_text(
                json.dumps(
                    {
                        "name": "generator-fixture",
                        "scripts": {},
                        "devDependencies": {
                            "eslint": "^8.57.0",
                            "@typescript-eslint/eslint-plugin": "^6.21.0",
                            "@typescript-eslint/parser": "^6.21.0",
                        },
                    }
                ),
                encoding="utf-8",
            )

            NOVA.update_package_json(target, changes)
            NOVA.write_ci(target, changes)

            package = json.loads((target / "package.json").read_text(encoding="utf-8"))
            self.assertEqual(package["engines"]["node"], "^22.13.0 || >=24")
            self.assertEqual(package["devDependencies"]["eslint"], "^10.9.1")
            self.assertEqual(package["devDependencies"]["@types/node"], "^24.0.0")
            self.assertNotIn(
                "@typescript-eslint/eslint-plugin", package["devDependencies"]
            )
            self.assertNotIn("@typescript-eslint/parser", package["devDependencies"])
            self.assertEqual(
                package["scripts"]["lint:baseline"],
                "node tools/verify_eslint_baseline.mjs",
            )
            self.assertIn("typecheck:anchor", package["scripts"])

            generated_workflow = (
                target / ".github/workflows/quality.yml"
            ).read_text(encoding="utf-8")
            canonical_workflow = (
                ROOT / ".github/workflows/quality.yml"
            ).read_text(encoding="utf-8")
            self.assertEqual(generated_workflow, canonical_workflow)


if __name__ == "__main__":
    unittest.main()
