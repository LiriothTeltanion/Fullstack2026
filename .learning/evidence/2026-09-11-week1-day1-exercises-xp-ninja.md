# Week 1 / Day 1 Exercises XP Ninja verification

- Recorded: `2026-09-11T16:03:47+03:00` (`Asia/Jerusalem`)
- Target: `Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/`
- Base revision: `origin/main` at `167c00835673`
- Repository evidence state: `verified` for the bounded behaviors below
- Learning state: `unknown` (`UNVERIFIED` until Kevin predicts, explains, and recreates the logic)
- Platform submission state: `UNVERIFIED`
- Requirement/source status: `VERIFIED` against the current source-safe Ninja summary supplied by Kevin on 2026-09-11, carrying a 2026-02-05 update label

The authenticated prompt, private chapter URL, dashboard data, and platform progress are not reproduced in this public record. This file stores only a behavioral comparison and reproducible repository evidence.

## Requirement comparison

| Exercise | Result | Evidence and boundary |
|---|---|---|
| 1 — Terminal and PATH | `VERIFIED` | The guide uses the Windows `python` command and explains that `PATH` is the directory search list used to find executables. Local command discovery resolved `python.exe` from `C:\Python314`. |
| 2 — `py` command | `VERIFIED` | `py.exe` resolved from `C:\Windows`; on this machine it is the Windows Python Launcher and starts an installed Python interpreter. It is not a PowerShell alias. |
| 3 — Predicted outputs | `VERIFIED` | Guesses are stored as comments before the six expressions and four assigned values. The script prints the expected ten results in order. |
| 4 — Character count | `VERIFIED` | One `print(len(my_text))` statement reports `445` for the continuous supplied prose. Seven visual wrapping breaks from the prior implementation are no longer counted as input characters. |
| 5 — Longest sentence without A | `VERIFIED` | Uppercase and lowercase A are rejected. A congratulations message appears only for a strictly longer valid sentence; shorter and equal-length inputs do not set a record. A blank input is a documented local exit affordance. |

## Focused test coverage

The seven-test suite covers:

- the PATH explanation;
- Windows Launcher terminology;
- all ten predicted values and output order;
- the 445-character continuous-text interpretation;
- uppercase and lowercase A rejection;
- invalid, shorter, equal-length, and longer Exercise 5 candidates; and
- finishing Exercise 5 with or without a valid record.

## Commands and observed results

```powershell
Get-Command python, py
where.exe python
where.exe py
python --version
py --version
py -3.12 --version
```

- `PASS`: `python` resolved to `C:\Python314\python.exe`; `py` resolved to `C:\Windows\py.exe`.
- `PASS`: both default commands reported Python 3.14.6 on this machine; the pinned validation command reported Python 3.12.10.

```powershell
py -3.12 -B -m unittest discover -s tests/python -p "test_week1_day1_exercises_xp_ninja.py" -v
```

- `PASS`: 7 tests ran and all passed.

```powershell
"" | py -3.12 -B Week1Python/Day1StartingwithPython/Exercises/ExercisesXPNinja/exercisesxpninja.py
```

- `PASS`: the complete non-blocking path printed the terminal explanations, ten boolean results, character count `445`, and the no-record exit message without a Windows console encoding error.

## What this evidence proves

- The repository implementation matches the five bounded Ninja behaviors supplied by Kevin.
- Windows command-resolution facts were observed on Kevin's current machine instead of being assumed.
- The interactive logic is separated into small functions that can be tested independently.

## What this evidence does not prove

- Kevin's independent prediction, explanation, recreation, or transfer to a new constraint.
- Octopus completion, submission, grading, instructor review, or diploma eligibility.
- Current official alignment of the separate Daily Challenge.

## AI assistance disclosure

Codex compared Kevin's source-safe summary with the historical implementation, simplified the code to Day 1 concepts, removed console-breaking decorative output, resolved the text-wrapping ambiguity, added deterministic tests, and prepared the evidence and presentation update. Kevin's learning state remains separate from repository verification.

## Kevin learning checkpoint

Before marking this work `explained`, Kevin should be able to:

1. write his own prediction for each Exercise 3 expression before running it;
2. explain why `True + 4` is `5` without treating booleans and integers as identical concepts;
3. explain the difference between `PATH`, a launcher, and a shell alias;
4. recreate the record-tracking loop without opening the solution; and
5. adapt Exercise 5 to forbid a different character and test an equal-length candidate.
