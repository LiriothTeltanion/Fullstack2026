# 🧩 Exercise - Build Facebook 1

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

A mock single-account login using arrays of objects, two prompts and a console newsfeed.

## ▶️ How to run

From the repository root, run `npm run dev` and open this folder's `index.html` at the server address. The script uses ES modules, so serve the page over HTTP.

Click **Sign in with prompts**. The page lists the artificial credentials. Try a valid pair, a wrong password. Open the developer console to see the feed logged after a successful sign-in.

## What the exercise does

- `database` contains one artificial user and `newsfeed` contains three original sample posts.
- `signIn` compares both credentials with the single user.
- A successful sign-in logs and displays the feed. An invalid pair produces one alert.
- Cancelling a prompt clears the previous feed and shows a cancellation message.

The account details are public mock data for practicing comparisons. Client-side comparisons keep the exercise focused on arrays and conditions.

Created 2026-11-25, Asia/Jerusalem.
