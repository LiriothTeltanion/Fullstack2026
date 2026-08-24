import json
import tempfile
import unittest
from pathlib import Path

from _loader import load_file

ROOT = Path(__file__).resolve().parents[2]
INTAKE = load_file("fullstack2026_learning_intake", ROOT / "tools/learning_intake.py")


class LearningIntakeTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.repo = Path(self.temporary.name)
        (self.repo / ".learning/intake").mkdir(parents=True)
        (self.repo / ".private/intake").mkdir(parents=True)
        (self.repo / "Week1Python/Day1StartingwithPython").mkdir(parents=True)
        (self.repo / ".learning/intake/queue.json").write_text(
            json.dumps({"schema_version": 1, "items": []}), encoding="utf-8"
        )

    def tearDown(self):
        self.temporary.cleanup()

    def source(self, **updates):
        value = {
            "week_id": "week-1",
            "public_safe_title": "String construction practice",
            "kevin_summary": "Build text from small pieces and return the expected final sentence.",
            "done_when": ["Normal input produces the expected sentence."],
            "item_kind": "exercise",
            "priority": "now",
            "planned_repository_path": None,
            "privacy_reviewed": True,
        }
        value.update(updates)
        return value

    def write_batch(self, items, name="batch.json"):
        path = self.repo / ".private/intake" / name
        path.write_text(
            json.dumps({"schema_version": 1, "items": items}), encoding="utf-8"
        )
        return path

    def test_builds_minimal_record_with_forced_truth_boundaries(self):
        timestamp = "2026-08-24T18:00:00+03:00"
        first = INTAKE.build_public_record(
            self.source(), self.repo, recorded_at=timestamp
        )
        second = INTAKE.build_public_record(
            self.source(), self.repo, recorded_at=timestamp
        )
        self.assertEqual(first["id"], second["id"])
        self.assertTrue(first["id"].startswith("w01-string-construction-practice-"))
        self.assertEqual(first["source_basis"], "kevin_authored_summary")
        self.assertEqual(first["requirement_fidelity"], "unverified")
        self.assertEqual(first["repository_state"], "missing")
        self.assertEqual(first["learning_state"], "unknown")
        self.assertEqual(first["queue_state"], "queued")
        self.assertEqual(INTAKE.validate_public_record(first, repo=self.repo), [])
        self.assertIsNone(INTAKE.validate_timestamp(timestamp))

    def test_rejects_unknown_and_protected_fields(self):
        for field in (
            "prompt",
            "rubric",
            "grade",
            "score",
            "xp",
            "platform_state",
            "attempts_remaining",
            "due_date",
            "octopus_id",
            "instructor",
            "screenshot",
            "learning_state",
        ):
            with self.subTest(field=field):
                with self.assertRaisesRegex(INTAKE.IntakeError, "unsupported or private"):
                    INTAKE.build_public_record(
                        self.source(**{field: "private value"}), self.repo
                    )

    def test_rejects_private_or_dump_like_content(self):
        values = (
            "Read the instructions at https://octopus.example/private and implement them.",
            "Use <script>alert('copied')</script> and produce the requested result.",
            "Include ![private screen](capture.png) when the implementation is complete.",
            "Contact student@example.com and then produce a validated program result.",
            "Use password=secret-value while building the requested authenticated flow.",
            "Call +972 50 123 4567 before creating the exercise implementation.",
        )
        for value in values:
            with self.subTest(value=value):
                with self.assertRaises(INTAKE.IntakeError):
                    INTAKE.build_public_record(
                        self.source(kevin_summary=value), self.repo
                    )

    def test_rejects_oversized_text_and_too_many_done_checks(self):
        with self.assertRaises(INTAKE.IntakeError):
            INTAKE.build_public_record(
                self.source(kevin_summary="x" * 601), self.repo
            )
        with self.assertRaises(INTAKE.IntakeError):
            INTAKE.build_public_record(
                self.source(done_when=["one", "two", "three", "four"]), self.repo
            )
        with self.assertRaises(INTAKE.IntakeError):
            INTAKE.build_public_record(
                self.source(done_when=["x" * 201]), self.repo
            )

    def test_paths_stay_inside_the_matching_existing_week(self):
        valid = INTAKE.build_public_record(
            self.source(
                planned_repository_path="Week1Python/Day1StartingwithPython"
            ),
            self.repo,
        )
        self.assertEqual(valid["repository_state"], "present")
        for path in (
            "../outside",
            "C:/private/course.txt",
            "Week2OOP/Day1IntroductiontoOOP",
            "Week1Python\\Day1StartingwithPython",
        ):
            with self.subTest(path=path):
                with self.assertRaises(INTAKE.IntakeError):
                    INTAKE.build_public_record(
                        self.source(planned_repository_path=path), self.repo
                    )

    def test_future_week_intake_cannot_predeclare_a_path(self):
        with self.assertRaisesRegex(INTAKE.IntakeError, "Weeks 7–12"):
            INTAKE.build_public_record(
                self.source(
                    week_id="week-7",
                    planned_repository_path="Week7NodejsAndReact/Day1PrivateTitle",
                ),
                self.repo,
                batch=True,
            )

    def test_queue_validation_rejects_state_elevation_and_duplicate_ids(self):
        record = INTAKE.build_public_record(self.source(), self.repo)
        elevated = dict(record, learning_state="mastered")
        problems = INTAKE.validate_queue_data(
            {"schema_version": 1, "items": [elevated, record]}, repo=self.repo
        )
        self.assertTrue(any("learning_state" in problem for problem in problems))
        self.assertTrue(any("duplicate id" in problem for problem in problems))

    def test_batch_dry_run_is_read_only_and_apply_is_atomic(self):
        queue_path = self.repo / ".learning/intake/queue.json"
        before = queue_path.read_bytes()
        valid_path = self.write_batch([self.source()])
        records = INTAKE.import_batch(
            self.repo,
            valid_path,
            apply=False,
            recorded_at="2026-08-24T18:00:00+03:00",
        )
        self.assertEqual(len(records), 1)
        self.assertEqual(queue_path.read_bytes(), before)

        invalid_path = self.write_batch(
            [self.source(), self.source(prompt="copied content")], "invalid.json"
        )
        with self.assertRaises(INTAKE.IntakeError):
            INTAKE.import_batch(self.repo, invalid_path, apply=True)
        self.assertEqual(queue_path.read_bytes(), before)

    def test_batch_outside_private_intake_is_rejected(self):
        outside = self.repo / "outside.json"
        outside.write_text(
            json.dumps({"schema_version": 1, "items": [self.source()]}),
            encoding="utf-8",
        )
        with self.assertRaisesRegex(INTAKE.IntakeError, "inside .private/intake"):
            INTAKE.import_batch(self.repo, outside)

    def test_next_item_is_read_only_and_respects_selection_and_priority(self):
        later = INTAKE.build_public_record(
            self.source(public_safe_title="Later practice", priority="later"), self.repo
        )
        now = INTAKE.build_public_record(
            self.source(public_safe_title="Immediate practice", priority="now"), self.repo
        )
        selected = INTAKE.build_public_record(
            self.source(public_safe_title="Selected practice", priority="optional"), self.repo
        )
        selected["queue_state"] = "selected"
        queue = {"schema_version": 1, "items": [later, now, selected]}
        before = json.dumps(queue, sort_keys=True)
        self.assertEqual(INTAKE.next_item(queue)["id"], selected["id"])
        self.assertEqual(json.dumps(queue, sort_keys=True), before)


if __name__ == "__main__":
    unittest.main()
