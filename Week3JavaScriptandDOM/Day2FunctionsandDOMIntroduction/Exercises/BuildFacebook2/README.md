# 🧩 Exercise - Build Facebook 2

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A mock three-account login using arrays of objects, two prompts and a console newsfeed.

## ▶️ How to run

From the repository root, run `npm run dev` and open this folder's `index.html` at the server address. The script uses ES modules, so serve the page over HTTP.

Click **Sign in with prompts**. The page lists the artificial credentials. Try a valid pair, a wrong password and the username from one row with the password from another. Open the developer console to see the feed logged after a successful sign-in.

## What the exercise does

- `database` contains three artificial users and `newsfeed` contains three original sample posts.
- `isUserValid` loops over the users and returns true only when both fields match one object. Its false return comes after the entire loop.
- A successful sign-in logs and displays the feed. An invalid pair produces one alert.
- Cancelling a prompt clears the previous feed and shows a cancellation message.

The account details are public mock data for practicing comparisons. Client-side comparisons keep the exercise focused on arrays and conditions.

Created 2026-11-25, Asia/Jerusalem.
