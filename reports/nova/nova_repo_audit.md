# 🪐 NOVA Repository Audit — _042_Fullstack2026

> Generated: `2026-07-15T01:45:47+00:00` by **NOVA Fullstack Repository Studio v1.1.1**.
> The readiness score is a transparent heuristic, not a course grade or proof that every program runs correctly.

## Executive snapshot

| Metric | Value |
|---|---:|
| Overall readiness | **42.8/100 (F)** |
| Scan scope | git-tracked files |
| Branch | `main` |
| HEAD | `3e56366b3f76` |
| Commits | 284 |
| Files | 378 |
| Working-tree size | 2.6 MB |
| Text lines | 39,758 |
| Source files | 202 |
| Documentation files | 133 |
| Test files | 1 |
| Exercise/project roots | 124 |

## Readiness percentages

| Category | Score | Weight |
|---|---:|---:|
| Learning Breadth | 100.0% | 20% |
| Documentation | 11.8% | 15% |
| Structure | 24.0% | 15% |
| Code Health | 19.1% | 15% |
| Testing | 10.6% | 15% |
| Tooling | 80.0% | 10% |
| Automation | 0.0% | 5% |
| Portfolio | 100.0% | 5% |

**Method:** Heuristic repository-readiness score. It is not a course grade and does not prove runtime correctness.

## Strengths

- ✅ Broad learning progression across 8 detected week modules.
- ✅ Multi-language portfolio spanning Python, browser development, TypeScript, SQL, and Node-oriented work.
- ✅ Strong documentation habit with 133 documentation files.
- ✅ Substantial hands-on practice with 54 detected mini-project/daily-challenge roots.
- ✅ Animated README assets create a distinctive and memorable portfolio identity.
- ✅ Rich Git history (284 commits) demonstrates sustained iteration.
- ✅ Several stronger projects already separate domain logic from user interaction, which is a good base for testing.

## Main risks

- ⚠️ Test files contain syntax errors: Week2OOP/Day5MiniProject/DailyChallenge/Modules/tests/test_timer.py: line 41: closing parenthesis ')' does not match opening parenthesis '['
- ⚠️ Possible credential or secret: Pattern: generic_secret_assignment; sample: API_KE…2My"
- ⚠️ Possible credential or secret: Pattern: generic_secret_assignment; sample: API_KE…7e7'
- ⚠️ Python syntax error: line 177: unterminated string literal (detected at line 177)
- ⚠️ Python syntax error: line 83: unterminated string literal (detected at line 83)
- ⚠️ Python syntax error: line 193: unterminated string literal (detected at line 193)
- ⚠️ Python syntax error: line 134: unterminated string literal (detected at line 134)
- ⚠️ Python syntax error: line 41: closing parenthesis ')' does not match opening parenthesis '['
- ⚠️ Broken local links or assets: 1 unresolved target(s): ../../Day2ListsIteratingAndFormattingData/
- ⚠️ Broken local links or assets: 1 unresolved target(s): ../../Day4Functions/
- ⚠️ Broken local links or assets: 2 unresolved target(s): ./DailyChallenge/README.md, ./Exercises/README.md
- ⚠️ Broken local links or assets: 1 unresolved target(s): fr

## Language distribution (source and tests)

| Language | Files | Bytes | Byte share | Lines | Line share |
|---|---:|---:|---:|---:|---:|
| Python | 70 | 283.5 KB | 45.90% | 8,903 | 46.12% |
| JavaScript | 61 | 123.6 KB | 20.01% | 4,158 | 21.54% |
| HTML | 42 | 123.2 KB | 19.94% | 3,757 | 19.46% |
| TypeScript | 12 | 43.7 KB | 7.07% | 1,359 | 7.04% |
| SQL | 6 | 24.1 KB | 3.91% | 665 | 3.45% |
| CSS | 12 | 19.6 KB | 3.17% | 461 | 2.39% |

## Week/module breakdown

| Module | Files | Size | Lines | Source | Tests | READMEs | Exercise roots |
|---|---:|---:|---:|---:|---:|---:|---:|
| Week1Python | 71 | 443.1 KB | 15,917 | 35 | 0 | 34 | 28 |
| Week1Python (2).zip | 1 | 206.0 KB | 0 | 0 | 0 | 0 | 0 |
| Week1Python.zip | 1 | 205.7 KB | 0 | 0 | 0 | 0 | 0 |
| Week2OOP | 73 | 318.4 KB | 9,834 | 34 | 1 | 34 | 25 |
| Week3JavaScriptandDOM | 101 | 1.2 MB | 5,220 | 67 | 0 | 14 | 32 |
| Week4AdvAsynchronousJavaScript | 42 | 85.6 KB | 2,579 | 29 | 0 | 13 | 15 |
| Week5MiniProjectAndTypeScript | 26 | 108.0 KB | 3,777 | 10 | 0 | 10 | 10 |
| Week6DatabasesAndNodejs | 51 | 48.8 KB | 1,556 | 26 | 0 | 7 | 14 |

## Findings

| Severity | Code | Finding | Path | Recommendation |
|---|---|---|---|---|
| **CRITICAL** | `broken_test_files` | Test files contain syntax errors: Week2OOP/Day5MiniProject/DailyChallenge/Modules/tests/test_timer.py: line 41: closing parenthesis ')' does not match opening parenthesis '[' | `Week2OOP/Day5MiniProject/DailyChallenge/Modules/tests/test_timer.py` | Repair test syntax before relying on any green test status. |
| **CRITICAL** | `possible_secret` | Possible credential or secret: Pattern: generic_secret_assignment; sample: API_KE…2My" | `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/giphyexercises.py` | Rotate exposed credentials immediately, remove them from Git history, and use environment variables or GitHub Secrets. |
| **CRITICAL** | `possible_secret` | Possible credential or secret: Pattern: generic_secret_assignment; sample: API_KE…7e7' | `Week5MiniProjectAndTypeScript/Day1Miniproject/DailyChallange/CurrencyConverter/index.html` | Rotate exposed credentials immediately, remove them from Git history, and use environment variables or GitHub Secrets. |
| **CRITICAL** | `python_syntax_error` | Python syntax error: line 177: unterminated string literal (detected at line 177) | `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/exercisesxpgold.py` | Fix the syntax error before running tests or CI. |
| **CRITICAL** | `python_syntax_error` | Python syntax error: line 83: unterminated string literal (detected at line 83) | `Week2OOP/Day3OOPandModules/DailyChallenge/UserInfo/dailychallengegolduserinfo.py` | Fix the syntax error before running tests or CI. |
| **CRITICAL** | `python_syntax_error` | Python syntax error: line 193: unterminated string literal (detected at line 193) | `Week2OOP/Day3OOPandModules/Exercises/ExercisesXPNinja/exercisesxpninjadunder.py` | Fix the syntax error before running tests or CI. |
| **CRITICAL** | `python_syntax_error` | Python syntax error: line 134: unterminated string literal (detected at line 134) | `Week2OOP/Day4PythonFileIOJSONandAPI/DailyChallenge/TextAnalysis/dailychallengetextanalysis.py` | Fix the syntax error before running tests or CI. |
| **CRITICAL** | `python_syntax_error` | Python syntax error: line 41: closing parenthesis ')' does not match opening parenthesis '[' | `Week2OOP/Day5MiniProject/DailyChallenge/Modules/tests/test_timer.py` | Fix the syntax error before running tests or CI. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): ../../Day2ListsIteratingAndFormattingData/ | `Week1Python/Day3Dictionaries/Exercises/ExercisesXP/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): ../../Day4Functions/ | `Week1Python/Day5MiniProject/Exercises/Hangman/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 2 unresolved target(s): ./DailyChallenge/README.md, ./Exercises/README.md | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): fr | `Week2OOP/Day3OOPandModules/DailyChallenge/Translator/readme.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): ./DailyChallenge/README.md | `Week2OOP/Day3OOPandModules/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 2 unresolved target(s): ./DailyChallenge/README.md, value | `Week2OOP/Day4PythonFileIOJSONandAPI/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): ../DailyChallenge/README_ANAGRAMS.md | `Week2OOP/Day5MiniProject/Exercises/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 2 unresolved target(s): DailyChallenge/README_ANAGRAMS.md, DailyChallenge/anagram_checker_all.py | `Week2OOP/Day5MiniProject/README.md` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `broken_local_links` | Broken local links or assets: 1 unresolved target(s): ${imageUrl} | `Week5MiniProjectAndTypeScript/Day1Miniproject/Exercises/Pokedex/index.html` | Correct paths after normalizing folder names; validate links before committing. |
| **HIGH** | `directory_collision` | Directory names collide by case or punctuation: Week1Python/Day3Dictionaries/Exercises/ExercisesXP, Week1Python/Day3Dictionaries/Exercises/ExercisesXP+ | `Week1Python/Day3Dictionaries/Exercises/ExercisesXP` | Merge content into one canonical directory using git mv on a dedicated branch. |
| **HIGH** | `directory_collision` | Directory names collide by case or punctuation: Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP, Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP+ | `Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP` | Merge content into one canonical directory using git mv on a dedicated branch. |
| **HIGH** | `lockfiles_ignored` | Package-manager lockfiles are ignored: package-lock.json, pnpm-lock.yaml, yarn.lock | `.gitignore` | Remove lockfile patterns from .gitignore and commit the selected lockfile for reproducible installs. |
| **HIGH** | `low_test_coverage` | Very low exercise-level automated test coverage: 1 of 124 detected exercise roots contain test files (0.8%). | `Week2OOP/Day5MiniProject/DailyChallenge/Modules/tests/test_timer.py` | Start with pure functions and domain classes in Tic-Tac-Toe, Hangman, OOP modules, TypeScript validators, and Node utilities. |
| **HIGH** | `missing_ci` | No GitHub Actions workflow: No tracked YAML workflow was found under .github/workflows/. | `—` | Add a read-only quality workflow for Python syntax, formatting, linting, tests, and report generation. |
| **HIGH** | `missing_lockfile` | No root package-manager lockfile: package.json exists, but no recognized lockfile is tracked. | `package.json` | Choose one package manager, run its install command, and commit exactly one lockfile. |
| **HIGH** | `node_test_without_tests` | Node test command has no discoverable test files: The root test script uses node --test, but no JavaScript/TypeScript test filename was detected. | `package.json` | Add .test.js/.spec.js tests for the strongest browser and Node modules. |
| **HIGH** | `root_archives` | Source archives stored at repository root: Week1Python (2).zip (206.0 KB), Week1Python.zip (205.7 KB) | `Week1Python (2).zip` | Confirm they are redundant, keep a local backup, then remove them from Git or move them to release assets. |
| **HIGH** | `stale_readme_revision` | README snapshot is stale: README revision fd10e5e does not match current HEAD 3e56366b3f76. | `README.md` | Generate repository statistics during the audit instead of hard-coding them. |
| **MEDIUM** | `duplicate_content` | Exact duplicate file content: 2 files share the same SHA-256: .eslintignore, .prettierignore | `.eslintignore` | Keep the canonical copy and replace intentional duplicates with references where practical. |
| **MEDIUM** | `duplicate_content` | Exact duplicate file content: 3 files share the same SHA-256: Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/DailyChallenge/.gitignore, Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXP/.gitignore, Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/Exercises/ExercisesXPGold/.gitignore | `Week5MiniProjectAndTypeScript/Day4AdvancedTypeScriptConceptsAndApplications/DailyChallenge/.gitignore` | Keep the canonical copy and replace intentional duplicates with references where practical. |
| **MEDIUM** | `eslint_path_mismatch` | ESLint ignore path does not match repository casing: Configured: Week5MiniprojectAndTypescript/**/compiled/; actual Week5 roots: Week5MiniProjectAndTypeScript. | `.eslintrc.cjs` | Use exact canonical paths after merging the duplicate Week5 directories. |
| **MEDIUM** | `missing_exercise_readmes` | Exercises without local README documentation: 31 of 124 detected exercise/project roots lack a local README. | `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXP` | Add a short README with goal, concepts, run command, expected behavior, edge cases, and improvement ideas. |
| **MEDIUM** | `nonportable_names` | Non-portable or inconsistent directory names: Detected 7 directory path(s). Examples: Week1Python/Day3Dictionaries/Exercises/ExercisesXP+ (plus sign); Week2OOP/Day5MiniProject/DailyChallenge/OOPQuizz (likely misspelling); Week3JavaScriptandDOM/Remote LearningJSAndDOM (space); Week4AdvAsynchronousJavaScript/Day5Fetch&AsyncAwait (ampersand); Week5MiniProjectAndTypeScript/Day1Miniproject/DailyChallange (likely misspelling); Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP+ (plus sign); Week6DatabasesAndNodejs/Day3DatabaseConcepts2/Exercises/ExercicesXPGold (likely misspelling) | `Week1Python/Day3Dictionaries/Exercises/ExercisesXP+` | Adopt one convention: Week/Day folders in PascalCase; project folders in PascalCase; Python files in snake_case; web files in kebab-case or camelCase. |
| **MEDIUM** | `placeholder_scripts` | Placeholder npm scripts: Scripts without real behavior: dev, build | `package.json` | Replace each placeholder with a working command or remove it until the integrated application exists. |
| **MEDIUM** | `readme_declares_missing_files` | README text names files that do not exist: Detected 104 unresolved backticked file reference(s). Examples: README.md → .github/workflows/quality.yml; Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/README.md → Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/2.0; Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/README.md → Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/2.0; Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPNinja/README.md → Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPNinja/collections.Counter; Week1Python/Day3Dictionaries/Exercises/ExercisesXP+/README.md → Week1Python/Day3Dictionaries/Exercises/ExercisesXP+/datetime.strptime; Week1Python/Day3Dictionaries/Exercises/ExercisesXP+/README.md → Week1Python/Day3Dictionaries/Exercises/ExercisesXP+/collections.Counter; Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/README.md → Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/datetime.strptime; Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/README.md → Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/dict.get; Week1Python/Day5MiniProject/Exercises/Hangman/README.md → Week1Python/Day5MiniProject/Exercises/Hangman/game.py; Week1Python/Day5MiniProject/Exercises/Hangman/README.md → Week1Python/Day5MiniProject/Exercises/Hangman/words.py | `README.md` | Regenerate directory trees from git ls-files and remove unsupported quality claims. |
| **LOW** | `svg_marked_binary` | SVG files are marked binary: Text-based SVG diffs will be hidden from normal Git reviews. | `.gitattributes` | Prefer '*.svg text eol=lf' unless the SVGs are generated and intentionally opaque. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 12 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/DailyChallenge/BuildUpAString/buildupastring.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 29 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 22 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXP/exercisesxp.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 9 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 10 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPGold/exercisesxpgold.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 9 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 22 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/exercisesxpninja.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day1StartingwithPython/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 10 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/DailyChallenge/GoldHappyBirthday/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/DailyChallenge/GoldHappyBirthday/happybirthday.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/DailyChallenge/ListAndStrings/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/DailyChallenge/ListAndStrings/dailychallengelistandstrings.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 11 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 15 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXP/exercisesxp.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 9 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPGold/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPGold/exercisesxpgold.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 12 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/Exercises/ExercisesXPNinja/exercisesxpninja.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 7 line(s) contain trailing spaces or tabs. | `Week1Python/Day2ListsIteratingAndFormattingData/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/DailyChallenge/CaesarCypher/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 21 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/DailyChallenge/Dictionaries/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 7 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/ExercisesXP+/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 23 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/ExercisesXPGold/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/ExercisesXPNinja/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/TimedChallenge1/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/Exercises/TimedChallenge2/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day3Dictionaries/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/DailyChallenge/SolveTheMatrix/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/DailyChallenge/SolveTheMatrix/solvethematrix.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/Exercises/ExercisesXP/exercisesxp.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 35 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/Exercises/ExercisesXPGold/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 6 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/Exercises/TimedChallenge1/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 56 line(s) contain trailing spaces or tabs. | `Week1Python/Day4Functions/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/DailyChallenge/AdvancedAlgorithm/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 4 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/DailyChallenge/Challenges/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/Exercises/Challenges1/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/Exercises/Challenges1/challengessolutions.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/Exercises/Challenges2/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 20 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/Exercises/Hangman/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/Exercises/TicTacToe/tictactoe.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 28 line(s) contain trailing spaces or tabs. | `Week1Python/Day5MiniProject/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 10 line(s) contain trailing spaces or tabs. | `Week1Python/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 7 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/DailyChallenge/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 109 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXP/exercisesxp.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPGold/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXPNinja/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/Exercises/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 11 line(s) contain trailing spaces or tabs. | `Week2OOP/Day1IntroductiontoOOP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPGold/exercisesxpgoldinheritance.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPGold/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPNinja/exercisesxpninjainheritance.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 10 line(s) contain trailing spaces or tabs. | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/Exercises/ExercisesXPNinja/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 21 line(s) contain trailing spaces or tabs. | `Week2OOP/Day2OOPInheritanceEncapsulationPolymorphism/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/DailyChallenge/Translator/dailychallengetranslator.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/DailyChallenge/Translator/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/DailyChallenge/UserInfo/dailychallengegolduserinfo.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/DailyChallenge/UserInfo/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/Exercises/ExercisesXPGold/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/Exercises/ExercisesXPNinja/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 62 line(s) contain trailing spaces or tabs. | `Week2OOP/Day3OOPandModules/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day4PythonFileIOJSONandAPI/DailyChallenge/TextAnalysis/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 4 line(s) contain trailing spaces or tabs. | `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXP/xp_files_json_all.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day4PythonFileIOJSONandAPI/Exercises/ExercisesXPGold/giphyexercises.py` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 186 line(s) contain trailing spaces or tabs. | `Week2OOP/Day4PythonFileIOJSONandAPI/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day5MiniProject/Exercises/RockPaperScissors/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/Day5MiniProject/Exercises/WeatherApp/readme.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 23 line(s) contain trailing spaces or tabs. | `Week2OOP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/RemoteLearningOOP/DailyChallenge/AirManagement/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week2OOP/RemoteLearningOOP/Exercises/MiniProjectVaccines/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/DailyChallenge/DailyChallengeNotBad/README_Not_Bad_JS.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 7 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/DailyChallenge/DailyChallengeStars/README_Stars_Pattern_JS.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPGold/README_JS_XP_Gold.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day1IntroductiontoJavaScript/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/DailyChallenge/DailyChallengePlanets/README_Solar_System.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/DailyChallenge/WordsInTheStars/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day2FunctionsandDOMIntroduction/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day3LearningDOMEvents/DailyChallenge/Letters/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 12 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXP/index_dom_exercises.html` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 8 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day3LearningDOMEvents/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day4AdvancedJavaScriptFunctions/Exercises/ExercisesXPNinja/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week4AdvAsynchronousJavaScript/Day1AdvancedArrayMethods/DailyChallenge/CarInventory/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week4AdvAsynchronousJavaScript/Day3HTTPAndFormMethodGETAndPOST/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 2 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day1Miniproject/DailyChallange/CurrencyConverter/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day1Miniproject/DailyChallange/CurrencyConverter/index.html` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day1Miniproject/Exercises/Pokedex/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 27 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day1Miniproject/Exercises/Pokedex/index.html` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 18 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day1Miniproject/StarWarsWebApp/index.html` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 4 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts/DailyChallenge/UnionTypeValidator/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 5 line(s) contain trailing spaces or tabs. | `Week5MiniProjectAndTypeScript/Day2IntroductionToTypeScriptAndKeyConcepts/DailyChallenge/UnionTypeValidator/src/index.ts` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 3 line(s) contain trailing spaces or tabs. | `Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXP/README.md` | Run the formatter and review the diff. |
| **LOW** | `trailing_whitespace` | Trailing whitespace detected: 1 line(s) contain trailing spaces or tabs. | `Week6DatabasesAndNodejs/Day1IntroductionToDatabases/Exercises/ExercisesXPGold/exercisesxpgold.md` | Run the formatter and review the diff. |

## Largest files

| File | Size | Category |
|---|---:|---|
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/ride.wav` | 429.2 KB | media |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/openhat.wav` | 238.1 KB | media |
| `Week1Python (2).zip` | 206.0 KB | archive |
| `Week1Python.zip` | 205.7 KB | archive |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/boom.wav` | 129.5 KB | media |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/tom.wav` | 104.6 KB | media |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/clap.wav` | 63.4 KB | media |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/hihat.wav` | 50.9 KB | media |
| `Week2OOP/Day4PythonFileIOJSONandAPI/README.md` | 42.7 KB | documentation |
| `Week3JavaScriptandDOM/Day5MiniProject/Exercises/drumset-mini/sounds/snare.wav` | 32.6 KB | media |
| `Week1Python/Day5MiniProject/README.md` | 32.0 KB | documentation |
| `Week1Python/Day4Functions/README.md` | 28.4 KB | documentation |
| `Week1Python/Day3Dictionaries/README.md` | 24.9 KB | documentation |
| `Week1Python/README.md` | 22.7 KB | documentation |
| `Week2OOP/Day1IntroductiontoOOP/Exercises/ExercisesXP/exercisesxp.py` | 20.8 KB | source |
| `Week1Python/Day5MiniProject/Exercises/Hangman/README.md` | 20.3 KB | documentation |
| `Week2OOP/Day3OOPandModules/README.md` | 20.3 KB | documentation |
| `Week5MiniProjectAndTypeScript/Day1Miniproject/Exercises/Pokedex/index.html` | 20.0 KB | source |
| `README.md` | 18.8 KB | documentation |
| `Week1Python/Day1StartingwithPython/README.md` | 17.4 KB | documentation |

## Priority action plan

### 1. Fix syntax errors before every other refactor
**Phase:** Stabilize · **Impact:** very high · **Effort:** small

A syntax error blocks trustworthy testing and CI.

- Open each critical syntax finding.
- Repair the first parser error.
- Run the studio again until Python syntax is 100% valid.

**Done when:** No critical syntax findings remain.

### 2. Merge duplicate Week5 and Week4 paths on a branch
**Phase:** Stabilize · **Impact:** very high · **Effort:** medium

Case-colliding directories are fragile across Windows, Linux, GitHub, and tooling.

- Create a dedicated cleanup branch in GitHub Desktop.
- Compare both directory trees.
- Move unique files into the canonical destination with git mv.
- Update links and run the audit.

**Done when:** Only one canonical path exists for each module and every local link resolves.

### 3. Select npm and commit package-lock.json
**Phase:** Reproducibility · **Impact:** high · **Effort:** small

Dependencies cannot be reproduced reliably without a tracked lockfile.

- Remove package-lock.json from .gitignore.
- Run npm install once at repository root.
- Review package-lock.json and commit it.

**Done when:** npm ci works from a fresh clone.

### 4. Remove duplicate Week1 ZIPs from the repository root
**Phase:** Hygiene · **Impact:** medium · **Effort:** small

Archives inflate clones and duplicate source history.

- Compare archive contents.
- Back them up outside the repository.
- Delete them from Git or attach them to a release if preservation is necessary.

**Done when:** No redundant source ZIP remains in the tracked root.

### 5. Regenerate README facts from the repository
**Phase:** Documentation · **Impact:** high · **Effort:** medium

A polished README loses trust when statistics, paths, and roadmap status contradict the code.

- Use the generated audit data rather than hard-coded counts.
- Mark Week6 SQL/Node as present.
- Remove references to missing files.
- Keep roadmap phases aligned with actual folders.

**Done when:** README paths resolve and its snapshot matches current HEAD.

### 6. Add a minimal read-only GitHub Actions quality workflow
**Phase:** Automation · **Impact:** high · **Effort:** medium

CI prevents syntax, link, formatting, and test regressions before merge.

- Install the suggested workflow template.
- Use contents: read permissions.
- Run Python compile checks and npm quality scripts.
- Fix failures before adding stricter gates.

**Done when:** A push and pull request both produce a green quality workflow.

### 7. Test five portfolio anchors first
**Phase:** Quality · **Impact:** very high · **Effort:** large

Testing every historical exercise at once is inefficient; high-value modules produce faster confidence.

- Test Tic-Tac-Toe pure functions.
- Test HangmanGame state transitions.
- Test one OOP domain model.
- Test UnionTypeValidator/LibrarySystem.
- Test one Node filesystem or data utility.

**Done when:** At least five representative projects have deterministic tests and CI runs them.

### 9. Build the integrated Nova Learning Dashboard capstone
**Phase:** Product · **Impact:** transformational · **Effort:** large

The repository becomes much stronger when historical exercises feed one deployable full-stack product.

- Design a small API and database schema.
- Add React + TypeScript UI.
- Implement authentication and progress tracking.
- Add integration tests and deployment.

**Done when:** A public deployment demonstrates authentication, persistence, API integration, tests, and responsive UI.

## Safety notes

- The default audit does not rename, move, delete, install, or execute project code.
- Optional external tool checks only run when `--run-tools` is provided.
- Rename application requires an approved CSV row plus `--yes`.
- Manual-merge rows are never applied automatically.
- Review every GitHub Desktop diff before committing.
