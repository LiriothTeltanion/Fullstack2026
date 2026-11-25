# Tools

<div align="center">

<img src="../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../assets/readme/progress/tools-0284c6ac58.svg" width="100%" alt="Progress card for Tools">

</div>

Scripts that keep the repository consistent. CI runs them on every pull request ([quality.yml](../.github/workflows/quality.yml)).

| Script | What it does |
|---|---|
| [`quality_gate.py`](quality_gate.py) | Syntax, JSON, HTML, CSS, links and likely secrets across the repo (`npm run quality`) |
| [`validate_repository_structure.py`](validate_repository_structure.py) | Folder paths, link casing, catalogs and secret checks |
| [`refresh_structure_catalogs.py`](refresh_structure_catalogs.py) | Rebuilds the catalogs in `reports/catalog/` (`npm run catalogs:refresh`) |
| [`validate_readme_visuals.py`](validate_readme_visuals.py) | README images, manifest hashes and alt text |
| [`validate_display_titles.py`](validate_display_titles.py) | Display titles for weeks and days |
| [`learning_intake.py`](learning_intake.py) | Exercise intake queue (`npm run intake`) |
| [`run_node_tests.mjs`](run_node_tests.mjs) | Runs the tests in `tests/js/` |
| [`check_typescript_syntax.mjs`](check_typescript_syntax.mjs) | TypeScript syntax check for the quality gate |
| [`verify_eslint_baseline.mjs`](verify_eslint_baseline.mjs) | Checks that ESLint findings match the known baseline |

```bash
python tools/quality_gate.py --repo . --strict
```
