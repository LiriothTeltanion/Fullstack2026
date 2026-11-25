# Access JWT middleware

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/exercises-xp-cac365f6ad.svg" width="100%" alt="Progress card for Exercises XP">

</div>

verifyToken.js reads an explicit bearer credential or the access cookie. It verifies the HS256 algorithm, issuer, audience and access purpose, then checks persistent session state and confirmed user status before allowing the request.
