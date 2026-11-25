# Authentication controllers

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

- authController.js validates registration, confirms the local email token, logs in, rotates refresh credentials, revokes logout sessions and returns profiles.
- usersController.js preserves the protected user-list exercise and removes hashes through toPublic.

Email confirmation is local practice. Real email delivery is an explicit remaining integration.
