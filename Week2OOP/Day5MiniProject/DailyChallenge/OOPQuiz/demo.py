
"""Small demo to showcase Deck API. 🎬

Run:
    python demo.py
"""
from deck import Deck

def main() -> None:
    deck = Deck()
    deck.shuffle()  # 🔀 randomize the fresh full deck
    hand = deck.deal_many(5)  # 🖐️ draw five
    print("🃏 Shuffled deck of 52 cards!")
    print("🖐️ Your hand:")
    for c in hand:
        print(" -", c)
    print(f"📦 Cards left: {len(deck)}")

if __name__ == "__main__":
    main()
