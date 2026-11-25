# Daily challenge: Translator 🌍🗣️

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/translator-31054dc2af.svg" width="100%" alt="Progress card for Translator">

</div>

My solution is in `dailychallengetranslator.py`.

## What it does
- Translates a list of French words to English using **googletrans** (Google Translate API wrapper).
- If the module or network isn't available, it **falls back** to a tiny hard-coded mapping for the provided demo list so you can still see the expected output.

## Install
```bash
pip install googletrans==4.0.0-rc1
```

## Run
```bash
python dailychallengetranslator.py
```
Expected output for the provided list:
```
{"Bonjour": "Hello", "Au revoir": "Goodbye", "Bienvenue": "Welcome", "A bientôt": "See you soon"}
```

## How it works
- The function `translate_words(words, src="fr", dest="en")` imports `Translator` lazily and batch-translates the list.
- The main block prints the resulting **dict mapping original→translated**, preserving the input order.
