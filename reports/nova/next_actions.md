# 🚀 NOVA Next Actions

Use this as a branch-by-branch implementation plan.

## P1 — Fix syntax errors before every other refactor

**Phase:** Stabilize  
**Impact:** very high  
**Effort:** small  

A syntax error blocks trustworthy testing and CI.

### Steps
- [ ] Open each critical syntax finding.
- [ ] Repair the first parser error.
- [ ] Run the studio again until Python syntax is 100% valid.

**Definition of done:** No critical syntax findings remain.

## P2 — Merge duplicate Week5 and Week4 paths on a branch

**Phase:** Stabilize  
**Impact:** very high  
**Effort:** medium  

Case-colliding directories are fragile across Windows, Linux, GitHub, and tooling.

### Steps
- [ ] Create a dedicated cleanup branch in GitHub Desktop.
- [ ] Compare both directory trees.
- [ ] Move unique files into the canonical destination with git mv.
- [ ] Update links and run the audit.

**Definition of done:** Only one canonical path exists for each module and every local link resolves.

## P3 — Select npm and commit package-lock.json

**Phase:** Reproducibility  
**Impact:** high  
**Effort:** small  

Dependencies cannot be reproduced reliably without a tracked lockfile.

### Steps
- [ ] Remove package-lock.json from .gitignore.
- [ ] Run npm install once at repository root.
- [ ] Review package-lock.json and commit it.

**Definition of done:** npm ci works from a fresh clone.

## P4 — Remove duplicate Week1 ZIPs from the repository root

**Phase:** Hygiene  
**Impact:** medium  
**Effort:** small  

Archives inflate clones and duplicate source history.

### Steps
- [ ] Compare archive contents.
- [ ] Back them up outside the repository.
- [ ] Delete them from Git or attach them to a release if preservation is necessary.

**Definition of done:** No redundant source ZIP remains in the tracked root.

## P5 — Regenerate README facts from the repository

**Phase:** Documentation  
**Impact:** high  
**Effort:** medium  

A polished README loses trust when statistics, paths, and roadmap status contradict the code.

### Steps
- [ ] Use the generated audit data rather than hard-coded counts.
- [ ] Mark Week6 SQL/Node as present.
- [ ] Remove references to missing files.
- [ ] Keep roadmap phases aligned with actual folders.

**Definition of done:** README paths resolve and its snapshot matches current HEAD.

## P6 — Add a minimal read-only GitHub Actions quality workflow

**Phase:** Automation  
**Impact:** high  
**Effort:** medium  

CI prevents syntax, link, formatting, and test regressions before merge.

### Steps
- [ ] Install the suggested workflow template.
- [ ] Use contents: read permissions.
- [ ] Run Python compile checks and npm quality scripts.
- [ ] Fix failures before adding stricter gates.

**Definition of done:** A push and pull request both produce a green quality workflow.

## P7 — Test five portfolio anchors first

**Phase:** Quality  
**Impact:** very high  
**Effort:** large  

Testing every historical exercise at once is inefficient; high-value modules produce faster confidence.

### Steps
- [ ] Test Tic-Tac-Toe pure functions.
- [ ] Test HangmanGame state transitions.
- [ ] Test one OOP domain model.
- [ ] Test UnionTypeValidator/LibrarySystem.
- [ ] Test one Node filesystem or data utility.

**Definition of done:** At least five representative projects have deterministic tests and CI runs them.

## P9 — Build the integrated Nova Learning Dashboard capstone

**Phase:** Product  
**Impact:** transformational  
**Effort:** large  

The repository becomes much stronger when historical exercises feed one deployable full-stack product.

### Steps
- [ ] Design a small API and database schema.
- [ ] Add React + TypeScript UI.
- [ ] Implement authentication and progress tracking.
- [ ] Add integration tests and deployment.

**Definition of done:** A public deployment demonstrates authentication, persistence, API integration, tests, and responsive UI.

## Suggested commit waves

1. `fix: repair syntax and broken tests`
2. `chore: normalize folders and remove duplicate archives`
3. `chore: track npm lockfile and align tooling paths`
4. `docs: regenerate repository catalog and roadmap`
5. `ci: add repository quality workflow`
6. `test: cover portfolio anchor projects`
7. `docs: add screenshots demos and accessibility notes`
