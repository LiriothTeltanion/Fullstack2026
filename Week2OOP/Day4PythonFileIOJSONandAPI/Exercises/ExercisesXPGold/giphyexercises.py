"""
File: giphyexercises.py
Role: Solutions for Giphy API #1 and #2. Uses f-strings, params, and filters. 🎞️🔎
Note: Requires network access. API key provided by the exercise. 🔑
"""

from __future__ import annotations

import os

from typing import Any, Dict, List, Tuple
import requests


API_KEY = os.getenv("GIPHY_API_KEY", "").strip()
BASE_SEARCH = "https://api.giphy.com/v1/gifs/search"
BASE_TRENDING = "https://api.giphy.com/v1/gifs/trending"


def _require_api_key() -> str:
    """Return the configured API key or explain how to configure it."""
    if not API_KEY:
        raise RuntimeError("Missing GIPHY_API_KEY. Copy .env.example and configure the variable outside Git.")
    return API_KEY


# ---------- Helpers ----------
def _filter_height_gt_100(data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Keep gifs whose 'original' image height > 100. 📏"""
    keep: List[Dict[str, Any]] = []
    for item in data:
        try:
            h = int(item["images"]["original"]["height"])
            if h > 100:
                keep.append(item)
        except Exception:
            continue
    return keep


def _first_n(data: List[Dict[str, Any]], n: int = 10) -> List[Dict[str, Any]]:
    """Return first N gifs. 🎯"""
    return data[:n]


# ---------- Exercise 2 (API #1) ----------
def search_hilarious(limit: int = 10, rating: str = "g") -> Tuple[List[Dict[str, Any]], int]:
    """Search 'hilarious' gifs; filter height>100; return (first_n, total_length_filtered). 😆"""
    q = "hilarious"
    # Build URL with f-strings as requested 🧱
    url = f"{BASE_SEARCH}?q={q}&rating={rating}&api_key={_require_api_key()}&limit=50"
    resp = requests.get(url, timeout=20)
    if resp.status_code != 200:
        raise RuntimeError(f"Giphy API error: {resp.status_code}")
    payload = resp.json()  # JSON object ✅
    data = payload.get("data", [])
    filtered = _filter_height_gt_100(data)   # height > 100 only
    total_len = len(filtered)                # length of filtered object
    first = _first_n(filtered, n=limit)      # only first 10 per requirement
    return first, total_len


# ---------- Exercise 3 (API #2) ----------
def search_or_trending(term: str, limit: int = 25, rating: str = "g") -> Tuple[List[Dict[str, Any]], bool]:
    """Search by user term; fallback to trending when no results or bad input. 🔄
    
    Returns (results, fallback_used).
    """
    term = (term or "").strip()
    if not term:
        # Directly fallback to trending 📉➡️📈
        t_url = f"{BASE_TRENDING}?api_key={_require_api_key()}&limit={limit}&rating={rating}"
        t_resp = requests.get(t_url, timeout=20)
        t_resp.raise_for_status()
        return t_resp.json().get("data", []), True

    url = f"{BASE_SEARCH}?q={term}&rating={rating}&api_key={_require_api_key()}&limit={limit}"
    resp = requests.get(url, timeout=20)
    if resp.status_code != 200:
        # On any API error, fallback to trending
        t_url = f"{BASE_TRENDING}?api_key={_require_api_key()}&limit={limit}&rating={rating}"
        t_resp = requests.get(t_url, timeout=20)
        t_resp.raise_for_status()
        return t_resp.json().get("data", []), True

    data = resp.json().get("data", [])
    if not data:
        # Fallback when empty
        t_url = f"{BASE_TRENDING}?api_key={_require_api_key()}&limit={limit}&rating={rating}"
        t_resp = requests.get(t_url, timeout=20)
        t_resp.raise_for_status()
        return t_resp.json().get("data", []), True

    return data, False


def _demo_cli() -> None:
    """Tiny demo for both exercises. 🧪"""
    print(">>> Giphy API #1 — hilarious (height>100, first 10)")
    try:
        first, total = search_hilarious(limit=10, rating="g")
        print("Filtered total (height>100):", total)
        print("Returning first 10 gifs (ids):", [g.get("id") for g in first])
    except Exception as e:
        print("API error:", e)

    print("\n>>> Giphy API #2 — user term or trending fallback")
    term = input("Enter a search term (or leave empty): ").strip()
    try:
        results, fallback = search_or_trending(term, limit=25, rating="g")
        src = "TRENDING (fallback)" if fallback else "SEARCH"
        print(f"Source: {src} — count: {len(results)}")
        print("Sample ids:", [g.get("id") for g in results[:10]])
    except Exception as e:
        print("API error:", e)


if __name__ == "__main__":
    _demo_cli()
