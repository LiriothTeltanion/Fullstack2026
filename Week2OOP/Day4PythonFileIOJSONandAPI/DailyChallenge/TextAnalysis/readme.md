# Daily Challenge — Text Analysis 📚🧠

Single-file solution: `dailychallengetextanalysis.py` (lowercase, no underscores).  
Comments/docstrings in **English** with emojis. ✨

## Classes
- **Text**
  - `word_frequency(word)` → case-insensitive count or `None` if not found.
  - `most_common_word()` → most frequent token.
  - `unique_words()` → sorted list of unique tokens.
  - `from_file(path)` → class method to read text from a file.
- **TextModification (inherits Text)**
  - `remove_punctuation()` → strips ASCII punctuation via `str.translate` + `string.punctuation`.
  - `remove_stop_words(stop_words=None)` → removes common English stop words; pass your own iterable to customize.
  - `remove_special_characters(keep_basic_punct=False)` → regex scrub; optional basic punctuation retention.

## Tokenization
- Uses a regex `[A-Za-z0-9']+` to keep words like *don't* and *O'Neill* (lowercased for analysis).

## Run
```bash
python dailychallengetextanalysis.py
```
The `__main__` block demonstrates each method. Replace `sample` with your own text, or load from a file:
```python
from dailychallengetextanalysis import TextModification
txt = TextModification.from_file("novel.txt")
clean = txt.remove_punctuation()
print(txt.most_common_word())
```

Happy analyzing! 🧪🔎
