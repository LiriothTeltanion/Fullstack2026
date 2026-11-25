# Recipe data

[`recipes.json`](recipes.json) contains six original sample recipes. Vite serves this file locally and copies it to the production build unchanged.

Each entry has a unique `id`, `title`, `description`, positive integer `minutes` and `servings`, nonempty `ingredients` with `name` and `quantity`, and nonempty preparation `steps`. No personal data or external API credentials are present.

The application validates the file at runtime. Run `npm test` from the [exercise folder](../README.md) after editing the data.
