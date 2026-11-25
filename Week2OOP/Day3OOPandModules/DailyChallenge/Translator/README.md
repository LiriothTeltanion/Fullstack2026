# 💪 Daily Challenge - Translator

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/translator-31054dc2af.svg" width="100%" alt="Progress card for Translator">

</div>

Four French greetings go in, a dictionary of English translations comes out. The translating is done by the `googletrans` module.

## ▶️ How to run

```bash
pip install googletrans==4.0.0-rc1   # optional
python dailychallengetranslator.py
```

```text
{'Bonjour': 'Hello', 'Au revoir': 'Goodbye', 'Bienvenue': 'Welcome', 'A bientôt': 'See you soon'}
```

If the package is missing or there's no internet, it prints a warning and an install hint first, then the same dictionary from a small built-in mapping.

## 🎯 The challenge

- `translate_words(words, src="fr", dest="en")` imports `Translator` inside the function, sends the whole list in one request and returns `{original: translated}`
- `main()` tries the live version first. On any error it switches to a hard-coded mapping of the four words and keeps the order of `french_words`
- At the top, `sys.stdout.reconfigure(encoding="utf-8")` runs when it's available, so the `⚠️` warning doesn't crash a Windows console that uses cp1252

## 🧠 What I learned

- If the import fails inside `translate_words()`, I raise an `ImportError` with the exact `pip` command in it
- `zip(words, results)` matches every French word with its translated result, no index needed
- Having an offline fallback means the demo prints the right dictionary even when the module or the network fails

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 2 Day 3 - OOP and Modules - Daily Challenge
