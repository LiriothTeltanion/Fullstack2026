# Exercises XP Ninja — Advanced Functions: Merge Words (Currying)

**Goal**  
Create a function such that `mergeWords('Hello')()` returns `"Hello"`, and chaining more calls collects words into a sentence, e.g.  
`mergeWords('There')('is')('no')('spoon.')()` → `"There is no spoon."`

## Implementation (curried)
- Repeatedly call the returned function with a word.
- Calling it with **no argument** returns the accumulated sentence.

## Files
- `index.js` — implementation + small console demo.

## Run
```bash
node index.js
```

## Example Output
```
Hello
There is no spoon.

one two three
```
