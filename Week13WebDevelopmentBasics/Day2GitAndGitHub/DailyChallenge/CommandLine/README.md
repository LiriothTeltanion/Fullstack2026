# 💪 Daily Challenge - Command Line

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/command-line-1bd7563286.svg" width="100%" alt="Progress card for Command Line">

</div>

Two parts. [commands.sh](commands.sh) practices the terminal for real: it builds a small site folder, copies, renames and deletes files, then makes the folder a Git repository with one commit. [index.html](index.html) is my cheat sheet of those commands, styled like a terminal.

## ▶️ How to run

The script works inside a temporary folder made with `mktemp -d` and deletes it at the end, so it never touches my own files:

```bash
bash commands.sh
```

```
1) Working in a temporary folder
2) Folders created:
css
images
js
3) index.html says: <h1>Hello from the command line</h1>
4) After copy, rename and delete:
css
index.html
js
5) index.html now has 2 lines
6) Files found with find:
my-site/css/style.css
my-site/js/app.js
7) Git log:
<hash> Initial commit
8) Temporary folder removed
```

The cheat sheet is a static page: open [index.html](index.html).

## 🎯 The challenge

| Step in `commands.sh` | Commands |
|---|---|
| 2. Make folders | `mkdir -p my-site/css my-site/js my-site/images` |
| 3. Create and fill files | `touch`, `echo ... >`, `cat` |
| 4. Copy, rename, delete | `cp`, `mv`, `rm`, `rmdir` |
| 5. Append and count | `echo ... >>`, `wc -l <` |
| 6. Search | `find my-site -type f \( -name "*.css" -o -name "*.js" \)` |
| 7. Git | `git init`, `git add .`, `git commit`, `git log --oneline` |

`set -euo pipefail` at the top stops the script at the first failing command. The commit passes its own name and email with `git -c`, so it works on a machine without a Git identity.

The cheat sheet groups the same commands into four cards (moving around, files, text, Git) with a `dl` list, and the blinking cursor stops under `prefers-reduced-motion`.

## 🧠 What I learned

- `>` replaces a file and `>>` adds to it, and mixing them up is an easy way to lose text
- `mkdir -p` creates the parent folders too, and doesn't complain if they already exist
- `rmdir` only removes empty folders, which is a nice safety net next to `rm`
- The `sed` at the end hides the commit hash, because a new hash on every run would make the sample output useless

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 13 Day 2 - Git and GitHub - Daily Challenge
