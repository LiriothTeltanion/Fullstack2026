
"""
🃏 Deck of Cards — Minimal, clean solution
- Card: immutable dataclass with suit/value ✅
- Deck: 52 cards, shuffle(), deal(), deal_many() ✅
- Neutral tone; friendly comments with emojis ✨
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Tuple
import random

# ♠️♦️ Standard suits & values (canonical order)
SUITS: Tuple[str, ...] = ("Hearts", "Diamonds", "Clubs", "Spades")
VALUES: Tuple[str, ...] = ("A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K")


@dataclass(frozen=True, slots=True)
class Card:
    """A single playing card. 🧩

    Validation is done at construction to prevent invalid cards. 🔒
    """
    suit: str
    value: str

    def __post_init__(self) -> None:
        if self.suit not in SUITS:
            raise ValueError(f"Invalid suit: {self.suit!r}. Allowed: {SUITS}")
        if self.value not in VALUES:
            raise ValueError(f"Invalid value: {self.value!r}. Allowed: {VALUES}")

    def __str__(self) -> str:
        return f"{self.value} of {self.suit}"  # e.g., "A of Spades" ✅


class Deck:
    """A standard 52‑card deck with shuffle and deal operations. 🎴

    Public API:
      - shuffle() → rebuilds full 52 and randomizes 🔀
      - deal() → pops a single card 🖐️
      - deal_many(n) → pops n cards safely 📦
      - len(deck) → remaining cards
      - iter(deck) → iterate remaining
    """
    _cards: List[Card]

    def __init__(self) -> None:
        self._cards = self._full_deck()  # fresh, sorted deck at start ✅

    @staticmethod
    def _full_deck() -> List[Card]:
        # Build the 52 unique cards. 🧱
        return [Card(s, v) for s in SUITS for v in VALUES]

    def shuffle(self) -> None:
        """Ensure the deck has all 52 cards, then shuffle randomly. 🔀"""
        self._cards = self._full_deck()
        random.shuffle(self._cards)

    def deal(self) -> Card:
        """Deal a single card from the top. Raises IndexError if empty. ❗"""
        if not self._cards:
            raise IndexError("Cannot deal from an empty deck")
        return self._cards.pop()

    def deal_many(self, n: int) -> List[Card]:
        """Deal n cards safely. n must be ≥ 0 and ≤ remaining. 📏"""
        if n < 0:
            raise ValueError("n must be >= 0")
        if n > len(self._cards):
            raise IndexError(f"Not enough cards left: requested {n}, have {len(self._cards)}")
        return [self._cards.pop() for _ in range(n)]

    def __len__(self) -> int:
        return len(self._cards)

    def __iter__(self) -> Iterable[Card]:
        # Iterate remaining cards (copy to avoid accidental external mutation). 🧷
        return iter(list(self._cards))


if __name__ == "__main__":
    # Tiny smoke test 🚭
    d = Deck()
    d.shuffle()
    hand = d.deal_many(5)
    print("🃏 Deck ready! Dealt 5:", ", ".join(map(str, hand)))
    print("Cards left:", len(d))
