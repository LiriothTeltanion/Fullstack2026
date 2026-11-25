# Exercise intake

A small tool I use to plan the next exercise in my own words. It never opens the course platform, copies course material, creates folders or submits anything.

## Add one exercise

From the repository root:

```powershell
npm run intake -- add
```

Answer the prompts in your own words. The tool shows the JSON record it will save and only writes it after you type `WRITE`.

## Add many at once

```powershell
# Create a local template in .private/ (git-ignored; existing files are kept)
npm run intake -- template

# Preview the batch, then apply it once every item is valid
npm run intake -- import .private/intake/kevin-batch.json
npm run intake -- import .private/intake/kevin-batch.json --apply
```

If one item is invalid, the whole batch is rejected, so nothing is half-imported.

## See what is next

```powershell
npm run intake -- next
npm run intake:check
```

`next` only reads the queue and prints my top item.

## Never include

- copied prompts, lessons, rubrics, quizzes, tests, feedback or starter code;
- platform URLs, IDs, screenshots or downloads;
- grades, XP, attendance, due dates or submission status;
- personal data, credentials, cookies or tokens.

For Weeks 7–12 the `planned_repository_path` stays empty until the lesson exists.

The format is defined in [`exercise-intake.schema.json`](exercise-intake.schema.json), and [`queue.json`](queue.json) is the public queue.
