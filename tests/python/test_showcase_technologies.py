import json
import tempfile
import unittest
from pathlib import Path

from _loader import ROOT, load_file

showcase = load_file("showcase_tags", ROOT / "tools/build_showcase.py")


class ShowcaseTechnologyTests(unittest.TestCase):
    def tags(self, manifests, sources, *, demo=False):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            files = [f"exercise/{name}" for name in sources]
            for name, manifest in manifests.items():
                path = repo / "exercise" / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(json.dumps(manifest), encoding="utf-8")
                files.append(f"exercise/{name}")
            return set(showcase.technologies(repo, "exercise", files, demo))

    def test_tsx_client_and_test_runner(self):
        manifests = {
            "package.json": {
                "dependencies": {"react": "19", "@reduxjs/toolkit": "2"},
                "scripts": {"test": "node --test"},
            },
            "tests/package.json": {"dependencies": {"express": "5"}},
        }
        self.assertEqual(self.tags(manifests, ["src/App.tsx", "vite.config.js"]), {"React", "Redux", "TypeScript"})

    def test_split_client_and_backend(self):
        manifests = {
            "client/package.json": {"dependencies": {"react": "19"}},
            "server/package.json": {"dependencies": {"express": "5"}},
        }
        self.assertEqual(self.tags(manifests, ["client/src/App.jsx", "server/index.js"]), {"React", "JavaScript", "Node.js"})

    def test_node_builtin_api_and_vanilla_demos(self):
        manifests = {"package.json": {"dependencies": {"react": "19"}, "scripts": {"api": "node server.js"}}}
        self.assertIn("Node.js", self.tags(manifests, ["src/App.jsx", "server.js"]))
        self.assertEqual(self.tags({}, ["index.html", "app.js"], demo=True), {"JavaScript", "HTML/CSS"})
        self.assertEqual(self.tags({}, ["cli.cjs"]), {"Node.js"})
