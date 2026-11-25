# Authentication persistence

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

- database.js creates the SQLite schema and enables foreign keys, WAL and a busy timeout.
- userModel.js preserves the lookup, create and public-profile interfaces, with durable users and hashed email-confirmation tokens.
- sessionModel.js stores refresh identifiers and revocation. Its compare-and-swap update gives each refresh token one successful use.
