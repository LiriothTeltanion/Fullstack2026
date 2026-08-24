# Source-safe exercise intake

This is the fastest supported path from Kevin's own understanding of an
Octopus item to a reviewable repository plan. It does **not** browse Octopus,
copy course material, create exercise folders, change learning evidence, or
submit anything.

## One exercise — fastest path

From the repository root, run:

```powershell
npm run intake -- add
```

Answer the short prompts using only your own words. The command shows the exact
public JSON record and writes it only after you type `WRITE`.

## Many current or future exercises

```powershell
# Create an ignored local template. Existing files are not overwritten.
npm run intake -- template

# Edit .private/intake/kevin-batch.json, then preview without writing.
npm run intake -- import .private/intake/kevin-batch.json

# Apply the complete batch only after every item validates.
npm run intake -- import .private/intake/kevin-batch.json --apply
```

The private batch is an editing buffer. The applied queue contains only short,
public-safe summaries. Any invalid item rejects the entire batch, so partial
imports cannot silently occur.

## Continue with the next item

```powershell
npm run intake -- next
npm run intake:check
```

`next` is read-only. It prints Kevin's highest-priority queued item; it does not
claim that Octopus marks the item as mandatory, started, completed, or graded.

## Never include

- copied prompts, lessons, rubrics, quizzes, tests, feedback, or starter code;
- authenticated/internal URLs, IDs, screenshots, downloads, or browser data;
- grades, XP, attendance, due dates, attempts, timers, submission state, or
  mandatory/optional LMS classification;
- instructor, cohort, peer, payment, profile, email, telephone, address,
  credential, cookie, token, password, or session information.

For Weeks 7–12, intake deliberately leaves `planned_repository_path` empty.
Select one item first; then map it to a stable folder only after Kevin's summary
provides enough source-safe context.

The schema is documented in
[`exercise-intake.schema.json`](exercise-intake.schema.json), while
[`queue.json`](queue.json) is the public planning queue. The broader policy and
action gates remain authoritative in [`../OCTOPUS_INTAKE.md`](../OCTOPUS_INTAKE.md).
