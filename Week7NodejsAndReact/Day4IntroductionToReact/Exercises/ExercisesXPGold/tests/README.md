# Component regression checks

Run `npm test` from the exercise directory. Node's test runner uses esbuild to compile the actual JSX components together with one React instance and the React server renderer. This verifies rendered props, safe text, the missing-link case, exactly six planets, the preserved original examples and the real App entrypoint.

These are component-rendering assertions, not a replacement for browser checks of Bootstrap CSS, layout, keyboard use or navigation. No application network, personal account or external database is used.
