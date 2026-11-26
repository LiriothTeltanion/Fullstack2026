"""
Advanced Algorithm - Two-Sum Pairs Finder
=========================================
CLI runner: generate 20k numbers and find all pairs summing to target.
Supports frequency counting and a sorted two-pointer scan.

Author: Kevin Cusnir 'Lirioth'
Repository: Fullstack2026
Week 1 Day 5 - Mini Project
Python Version: 3.10+
"""
import argparse, time
from src.demodata import make_dataset
from src.pairs import find_value_pairs_hash, find_value_pairs_two_pointer

def main():
    ap = argparse.ArgumentParser(description="Find all pairs summing to target in a list of random numbers.")
    ap.add_argument("--target", type=int, default=3728, help="Target sum (default: 3728)")
    ap.add_argument("--seed", type=int, default=None, help="Random seed for reproducibility (default: None)")
    ap.add_argument("--n", type=int, default=20000, help="Number of random values (default: 20000)")
    ap.add_argument("--low", type=int, default=0, help="Minimum random value (default: 0)")
    ap.add_argument("--high", type=int, default=10000, help="Maximum random value (default: 10000)")
    ap.add_argument("--algo", choices=["hash", "two-pointer"], default="hash", help="Algorithm to use (default: hash)")
    ap.add_argument("--sample", type=int, default=10, help="Maximum pairs to display; 0 shows only totals (default: 10)")
    args = ap.parse_args()
    if args.n < 0:
        ap.error("--n must be zero or greater")
    if args.low > args.high:
        ap.error("--low must be less than or equal to --high")

    nums, default_target = make_dataset(n=args.n, low=args.low, high=args.high, seed=args.seed)
    target = args.target if args.target is not None else default_target

    print("=== Two-Sum Pairs Finder ===")
    print(f"Target: {target}")
    print(f"Numbers: {len(nums)} (range {args.low}..{args.high})")
    print(f"Algorithm: {args.algo}")

    t0 = time.perf_counter()
    if args.algo == "hash":
        pairs, total_index_pairs = find_value_pairs_hash(nums, target)
    else:
        pairs = find_value_pairs_two_pointer(nums, target)
        total_index_pairs = None
    dt = (time.perf_counter() - t0) * 1000.0

    print(f"Unique value pairs found: {len(pairs)}")
    if total_index_pairs is not None:
        print(f"Total index-pairs (with multiplicities): {total_index_pairs}")
    print(f"Time: {dt:.2f} ms\n")

    if not pairs:
        print("No pairs found.")
    elif args.sample > 0:
        print("Sample pairs:")
        for a, b in pairs[:args.sample]:
            print(f"- {a} and {b} sum to {target}")

if __name__ == "__main__":
    main()
