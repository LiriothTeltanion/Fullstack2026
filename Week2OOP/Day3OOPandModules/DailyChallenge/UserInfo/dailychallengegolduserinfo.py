"""
File: dailychallengegolduserinfo.py
Purpose: OOP solution for "Daily Challenge GOLD — User Info" using a lambda sorting key. 🧠✨
Author: Kevin "Lirioth" Cusnir
Date: 2025-10-11 | TZ: Asia/Jerusalem

Spec:
- Prompt the user 5 times for: Name, Age, Score.
- Build a list of tuples (name, age, score) — kept as strings for display parity.
- Sort by Name > Age > Score (ascending) using a lambda key.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple


Record = Tuple[str, str, str]  # (name, age, score) — all strings for expected output


@dataclass
class UserInfoApp:
    """Collect and sort user records with a lambda-based key. 🔎➡️🔠"""

    rounds: int = 5  # exactly five prompts by default

    def collect(self) -> List[Record]:
        """Collect `rounds` records interactively.
        
        Input format: 'Name,Age,Score' (e.g., John,20,90) 📝
        Age and Score must be integers; stored as strings to match the example output.
        """
        rows: List[Record] = []
        for i in range(1, self.rounds + 1):
            while True:
                raw = input(f"[{i}/{self.rounds}] Enter 'Name,Age,Score': ").strip()
                parts = [p.strip() for p in raw.split(",")]
                if len(parts) != 3 or not parts[0]:
                    print("Use the format: Name,Age,Score  (e.g., John,20,90) ⚠️")
                    continue
                name, age_s, score_s = parts
                try:
                    int(age_s)     # validate integer 🧮
                    int(score_s)   # validate integer 🧮
                except ValueError:
                    print("Age and Score must be integers. Try again. ⚠️")
                    continue
                rows.append((name, age_s, score_s))
                break
        return rows

    @staticmethod
    def sort_records(records: List[Record]) -> List[Record]:
        """Sort by Name > Age > Score using a lambda key. 🧩
        
        The lambda returns a key tuple (name, age_int, score_int) for proper numeric ordering.
        """
        return sorted(records, key=lambda t: (t[0], int(t[1]), int(t[2])))


def _demo_sample() -> None:
    """Demonstrate sorting with the sample from the prompt. 🎬"""
    sample = [
        ("Tom", "19", "80"),
        ("John", "20", "90"),
        ("Jony", "17", "91"),
        ("Jony", "17", "93"),
        ("Json", "21", "85"),
    ]
    print(UserInfoApp.sort_records(sample))


if __name__ == "__main__":
    print("=== Daily Challenge GOLD — User Info (OOP + lambda) ===")
    print("Enter: Name,Age,Score   e.g., John,20,90")
    try:
        app = UserInfoApp(rounds=5)
        records = app.collect()
        sorted_records = app.sort_records(records)
        print("Sorted:", sorted_records)
    except (EOFError, KeyboardInterrupt):
        print("\nNo interactive input. Showing the sample demonstration instead:")
        _demo_sample()
