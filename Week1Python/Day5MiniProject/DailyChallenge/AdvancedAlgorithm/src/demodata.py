"""
Advanced Algorithm - Data Generation Module
============================================
Random dataset generation for algorithm testing.
Provides reproducible test data with configurable size and range.
Supports seeding for deterministic results.

Author: Kevin Cusnir 'Lirioth'
Repository: Fullstack2026
Week 1 Day 5 - Mini Project
Python Version: 3.10+
"""
import random
from typing import List, Tuple

def make_dataset(n: int = 20000, low: int = 0, high: int = 10000, seed: int | None = None) -> Tuple[list[int], int]:
    """Return n random integers from the inclusive bounds and the example target.

    Pass a seed to repeat the same dataset.
    """
    if seed is not None:
        random.seed(seed)
    nums = [random.randint(low, high) for _ in range(n)]
    target = 3728
    return nums, target
