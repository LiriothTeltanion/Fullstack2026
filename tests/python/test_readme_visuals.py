import hashlib
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from tools.validate_readme_visuals import validate


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

    def test_manifested_nested_svg_must_meet_accessibility_and_motion_contract(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><style>.trace { animation: move 1s linear; }</style></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset)

            problems = validate(repo)

            self.assertIn("SVG needs title and desc elements: assets/readme/days/day.svg", problems)
            self.assertIn("animated SVG lacks reduced-motion behavior: assets/readme/days/day.svg", problems)

    def test_manifested_nested_svg_dimensions_and_view_box_must_match(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Day</title><desc>Evidence map</desc></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset, dimensions="900x300", view_box="0 0 900 300")

            problems = validate(repo)

            self.assertTrue(any(problem.startswith("visual manifest dimensions drift:") for problem in problems))
            self.assertTrue(any(problem.startswith("visual manifest viewBox drift:") for problem in problems))

    def test_narrative_svg_requires_motion_story_and_motion_qa(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Day</title><desc>Evidence map</desc></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset, motion_required=True)

            problems = validate(repo)

            self.assertIn("narrative SVG requires purposeful motion: assets/readme/days/day.svg", problems)
            self.assertIn("narrative SVG is missing motion_story: assets/readme/days/day.svg", problems)
            self.assertIn("narrative SVG is missing motion_qa: assets/readme/days/day.svg", problems)

    def test_motion_required_manifest_value_must_be_boolean(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Day</title><desc>Evidence map</desc></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset, motion_required="yes")

            problems = validate(repo)

            self.assertIn(
                "visual manifest motion_required must be boolean: assets/readme/days/day.svg",
                problems,
            )

    def test_manifest_must_explicitly_classify_motion_required(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/reference.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Reference</title><desc>Static map</desc></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset, motion_required=None)

            problems = validate(repo)

            self.assertIn(
                "visual manifest must classify motion_required: assets/readme/reference.svg",
                problems,
            )

    def test_manifested_nested_svg_consumer_alt_text_must_match_manifest(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Day</title><desc>Evidence map</desc></svg>',
                encoding="utf-8",
            )
            self._write_fixture_manifest(repo, asset, alt_text="Current verified evidence map")
            guide = repo / "docs/README.md"
            guide.parent.mkdir()
            guide.write_text(
                '<img src="../assets/readme/days/day.svg" alt="Stale pending evidence map">\n',
                encoding="utf-8",
            )

            problems = validate(repo)

            self.assertIn(
                "manifested visual alt text drift: docs/README.md: assets/readme/days/day.svg",
                problems,
            )

    def test_manifested_visual_consumer_rejects_unmanifested_legacy_svg(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            repo = Path(temp_dir)
            asset = repo / "assets/readme/days/day.svg"
            legacy_asset = repo / "assets/readme/legacy.svg"
            asset.parent.mkdir(parents=True)
            asset.write_text(
                '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="440" '
                'viewBox="0 0 1200 440"><title>Day</title><desc>Evidence map</desc></svg>',
                encoding="utf-8",
            )
            legacy_asset.write_text('<svg xmlns="http://www.w3.org/2000/svg" />', encoding="utf-8")
            self._write_fixture_manifest(repo, asset, alt_text="Current verified evidence map")
            guide = repo / "docs/README.md"
            guide.parent.mkdir()
            guide.write_text(
                '<img src="../assets/readme/days/day.svg" alt="Current verified evidence map">\n'
                '<img src="../assets/readme/legacy.svg" alt="Legacy animation">\n',
                encoding="utf-8",
            )

            problems = validate(repo)

            self.assertIn(
                "manifested visual consumer references unmanifested SVG: "
                "docs/README.md: assets/readme/legacy.svg",
                problems,
            )

    @staticmethod
    def _write_fixture_manifest(
        repo: Path,
        asset: Path,
        *,
        dimensions: str = "1200x440",
        view_box: str = "0 0 1200 440",
        alt_text: str = "Evidence map",
        motion_required: bool | str | None = False,
    ) -> None:
        (repo / "README.md").write_text("# Fixture\n", encoding="utf-8")
        relative = asset.relative_to(repo).as_posix()
        entry = {
            "path": relative,
            "sha256": hashlib.sha256(asset.read_bytes()).hexdigest(),
            "dimensions": dimensions,
            "view_box": view_box,
            "alt_text": alt_text,
            "privacy_review": "passed_no_private_dashboard_data",
        }
        if motion_required is not None:
            entry["motion_required"] = motion_required
        manifest = {
            "assets": [
                entry
            ]
        }
        manifest_path = repo / "assets/readme/visual_manifest.json"
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(json.dumps(manifest), encoding="utf-8")


if __name__ == "__main__":
    unittest.main()
