# 🗄️ Models - Notes App

<div align="center">

<img src="../../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../../assets/readme/progress/notes-app-1218b18800.svg" width="100%" alt="Progress card for Notes App">

</div>

The data access functions for Notes App.

## Contents

- [`notesModel.js`](notesModel.js)

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 3 - Mini-project Day - Mini Project


File mutations are ordered within one Node process, and each save replaces the data file through a unique temporary file. Reads share the same queue to avoid Windows file replacement contention. Multiple independent server processes require transactional shared storage.
