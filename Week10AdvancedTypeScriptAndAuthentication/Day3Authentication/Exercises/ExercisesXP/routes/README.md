# API routes

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

authRoutes.js exposes registration, email confirmation, login, refresh, logout and protected profile routes. Registration, confirmation and login each have a separate limiter. Refresh has its own longer budget.

usersRoutes.js applies verifyToken before the existing user-list endpoint.
