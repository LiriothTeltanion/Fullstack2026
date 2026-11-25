# Daily Challenge — Not Bad (JavaScript)

Replace the first occurrence of a `not ... bad` segment with `good` **only if** `bad` appears **after** `not`. Otherwise, keep the sentence unchanged.

---

## Files
- `index.html` — minimal UI with a button + result area.
- `script.js` — main logic (`checkSentence()`), console logs, and DOM update.

## How it works
1. Prompt the user for a sentence (`prompt(...)`).
2. Find positions:
   - `wordNot = sentence.indexOf("not")`
   - `wordBad = sentence.indexOf("bad")`
3. If both are found and `wordBad > wordNot`:
   - Build: `before = sentence.slice(0, wordNot)`  
     `after = sentence.slice(wordBad + 3)`  *(3 = 'bad'.length)*  
     `result = before + "good" + after`
4. Else, `result = sentence`.
5. Show `result` in `#result` and log details in the console.

## How to run
Open `index.html` in a browser and click **Run**.  
- Enter a string like: `This dinner is not that bad ! You cook well`  
- Result: `This dinner is good ! You cook well`

## Examples
Input → Output
- `without,hello,bag,world` → *(not applicable here, from a different task)*
- `This movie is not so bad !` → `This movie is good !`
- `This dinner is bad !` → `This dinner is bad !`

## Edge cases & tweaks (optional)
- **Case-insensitive**: treat `Not`, `BAD` the same using a regex (`/not.*?bad/i`).  
- **Multiple pairs**: current code handles the first `not ... bad`. You can extend to replace all matches (`/not.*?bad/gi`) if desired.
- **Trim inputs**: call `.trim()` to avoid leading/trailing spaces affecting indexes.
- **Whole words only** (optional): use word boundaries in regex (e.g., `/\bnot\b.*?\bbad\b/i`).

## Complexity
Single pass `indexOf` + slicing → **O(n)** time, **O(n)** space for the new string.

---

## Testing checklist
- `The movie is not that bad, I like it` → `The movie is good, I like it`
- `This dinner is bad !` → unchanged
- `Not really that BAD` (case-insensitive desired?) → switch to regex
- `This is not bad` → `This is good`
