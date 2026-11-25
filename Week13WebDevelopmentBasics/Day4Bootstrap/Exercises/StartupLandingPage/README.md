# 🌄 Exercise - Startup Landing Page

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

An original landing page for a fictional creative studio. It has a photographic background, headline and subscription call to action.

## ▶️ How to run

Serve the repository with `npm run dev` and open this folder's `index.html`. The ES module reads the public configuration in [signup-config.js](signup-config.js).

## Subscription configuration

Set `MAILCHIMP_SIGNUP_URL` to the public HTTPS signup URL from a Mailchimp form you own. It is a public destination URL, so keep credentials and account tokens out of this file.

The default value is empty. In that state, the button opens a local explanation and the page collects no email addresses. Connecting and testing an owned public form is the remaining integration step.

[Mailchimp hosted signup forms](https://mailchimp.com/help/share-your-signup-form/)

## What I can explain

- A layered background image keeps the headline readable.
- Responsive type and spacing keep the CTA usable on small screens.
- The external signup form handles the subscription data when configured.
- The page keeps its local demo usable when the URL is empty or invalid.

The landscape background comes from [Unsplash](https://images.unsplash.com/photo-1470770841072-f978cf4d019e). The fictional product copy is original.

Created 2026-11-25, Asia/Jerusalem.
