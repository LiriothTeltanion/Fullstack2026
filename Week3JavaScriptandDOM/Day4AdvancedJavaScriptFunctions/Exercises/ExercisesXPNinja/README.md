# Exercises XP Ninja — Advanced Functions: Merge Words (Currying)

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/exercises-xpninja-a856c80b40.svg" width="100%" alt="Progress card for Exercises XPNinja">

</div>

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
