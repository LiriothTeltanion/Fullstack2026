# 📄 Day 4 — File I/O, JSON and APIs

<div align="center">

<img src="../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../assets/readme/progress/day4-python-file-iojsonand-api-f45fc61397.svg" width="100%" alt="Progress card for Day4 Python File IOJSONand API">

</div>

Day 4 was the first time my programs talked to the outside world: reading and writing files, loading and saving JSON, and calling a real web API (Giphy).

## 📁 What's here

- [Exercises](Exercises/)
  - [ExercisesXP](Exercises/ExercisesXP/) — a random sentence generator that reads words from a file, and a JSON exercise that reads, edits and saves employee data
  - [ExercisesXPGold](Exercises/ExercisesXPGold/) — a restaurant menu manager stored in JSON, plus two Giphy API exercises
  - [ExercisesXPNinja](Exercises/ExercisesXPNinja/) — a Valentine's menu with regex validation and a D&D character generator that exports JSON and TXT
- [Daily Challenge](DailyChallenge/) — [TextAnalysis](DailyChallenge/TextAnalysis/), word counts and text cleanup with a `Text` class and a subclass

## 🚀 How to run

From this folder:

```bash
python Exercises/ExercisesXP/xp_files_json_all.py
python DailyChallenge/TextAnalysis/dailychallengetextanalysis.py
cd Exercises/ExercisesXPGold && python menueditor.py
```

The Giphy exercises need `requests` and your own API key in the `GIPHY_API_KEY` environment variable (see `.env.example` at the repo root):

```bash
pip install requests
cd Exercises/ExercisesXPGold && python giphyexercises.py
```

## 💡 Key concepts

```python
@dataclass
class MenuManager:
    filepath: str = "restaurantmenu.json"
    menu: Dict[str, List[Dict[str, object]]] = field(default_factory=lambda: {"items": []})

    def _load(self) -> None:
        with open(self.filepath, "r", encoding="utf-8") as f:
            self.menu = json.load(f)
        self.menu.setdefault("items", [])

    def save_to_file(self) -> None:
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(self.menu, f, indent=2, ensure_ascii=False)
```

- `with open(...)` closes the file for me, even if something fails
- `json.load` / `json.dump` turn files into dicts and lists and back
- `try` / `except` keeps bad input or a missing file from crashing the program
- `requests.get(url)` plus `response.status_code` and `response.json()` for APIs
- API keys belong in environment variables, never in the code

## 🎓 What I learned

Keeping the file handling inside a `MenuManager` class meant the menu editor didn't need to know anything about the JSON file. With the Giphy API I learned to always check the status code before using the data, and to fall back to trending GIFs when a search returns nothing.

## 👤 Author

**Kevin "Lirioth" Cusnir**
https://github.com/LiriothTeltanion/Fullstack2026
