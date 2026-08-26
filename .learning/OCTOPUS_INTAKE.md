# Octopus authenticated-course intake

> Public workflow only. Passwords, session data, raw authenticated screenshots,
> private URLs, scores, quiz banks, and full course-owned prompts do not belong in Git.

## Purpose

Use the authenticated Developers Institute platform as the assignment authority
without turning this public repository into a mirror of private course material.
The workflow separates four independent evidence dimensions:

| Dimension | Example states |
|---|---|
| Source | `missing`, `captured`, `changed`, `conflicted` |
| Platform | `not_started`, `in_progress`, `submitted`, `graded`, `needs_revision` |
| Repository | `missing`, `present`, `runnable`, `verified`, `portfolio` |
| Learning | `unknown`, `explained`, `mastered` |

## Current policy gate — verified 2026-08-24

The currently published [Octopus Privacy Policy](https://octopus.developers.institute/privacy/)
restricts copying, scraping, reproducing, redistributing, uploading course
materials to AI tools, and using course content for AI training without written
permission. The [Octopus Terms of Service](https://octopus.developers.institute/terms/)
contain a narrower educational-content clause alongside broader proprietary-content
restrictions, so they are not treated as blanket permission.

Until Developers Institute clarifies the boundary in writing:

- do not automate or scrape authenticated Octopus course pages;
- do not paste or upload prompts, screenshots, rubrics, feedback, quizzes,
  tests, lesson text, starter files, or other course materials into external AI;
- keep the existing 2026-08-24 metadata capture frozen, ignored, private, and
  unavailable to public generators;
- work from Kevin's own code, Kevin-authored requirement summaries, public DI
  program pages, and material that DI explicitly authorizes for this workflow;
- do not assume that Octopus's built-in AI tutor permits external AI use on a
  graded exercise or final-project submission.

This is a conservative repository-compliance rule, not legal advice.

## Authentication boundary

1. Kevin opens and uses the official Octopus interface directly.
2. Credentials, CAPTCHA answers, MFA codes, cookies, and session data are never
   pasted into chat, copied to files, or read from browser storage.
3. Codex does not crawl, scrape, or bulk-extract authenticated course material.
4. Kevin may provide an independently written summary of a requirement and his
   own source code for review; verbatim course material requires written DI permission.
5. Do not start a timed assessment, consume an attempt, upload, submit, retry,
   enroll, message, or save profile changes without separate action-time approval.

## Private local intake

Authenticated evidence belongs in an excluded local workspace such as:

```text
.private/octopus/
├─ course-inventory.json
├─ item-inventory.json
├─ profile-audit.json
├─ captures/
└─ downloads/
```

The entire `.private/` tree is ignored by Git. Before every commit, the
repository validators also confirm that no `.private/` path is indexed. The
existing files are a frozen legacy capture, not authorization to recapture or
expand protected course content. Git ignore is not encryption or cloud-storage
protection; this checkout is under a OneDrive path whose live sync state remains
unverified.

Private item records may contain:

```text
source_id
course_id
week_or_module
day_or_section
item_order
exact_title_private
public_safe_title
item_type
mandatory_or_optional
platform_state
timer_present
attempt_consumed_on_open
attempts_remaining
rubric_present
starter_files_present
submission_type
due_date_private
feedback_present
captured_at
source_hash
planned_repository_path
repository_state
learning_state
```

## Public repository boundary

Publicly acceptable evidence includes:

- Kevin-authored source code and revisions;
- Kevin's independently written, short requirement summary;
- original tests, fixtures, commands, and observed results;
- sanitized screenshots of Kevin's own application output;
- accessibility, security, limitation, and AI-assistance notes;
- public week/technology names and public Developers Institute program links.

Keep private:

- raw dashboard and profile screenshots;
- full prompts, rubrics, quiz/test banks, official solutions, videos, and slide decks;
- grades, progress, XP, attempts, attendance, payment, cohort, calendar, and peer data;
- instructor feedback and identities;
- authenticated URLs, internal identifiers, cookies, tokens, and browser-storage data;
- starter assets or downloads whose redistribution permission is unclear.

## Inventory order

1. Obtain written clarification for external-AI use, public solution publication,
   prompt paraphrasing, and the educational-content license boundary.
2. Freeze and hash the existing private metadata snapshot; do not expand it by
   automated authenticated browsing.
3. Let Kevin identify the next mandatory item directly in Octopus and write a
   requirement summary in his own words.
4. Mark timed, attempt-limited, submission, and save actions as approval-gated.
5. Map only the authorized summary to an existing stable repository path.
6. Verify Kevin-authored code one assignment at a time.
7. Keep optional courses below the mandatory queue until their use is both
   policy-safe and learning-relevant.

## One-assignment verification loop

Use Recall → Read → Predict → Run → Explain → Refactor + Test → Record.

1. Kevin recalls the concept before reading an AI explanation.
2. Review Kevin's source-safe summary and current local solution.
3. Kevin predicts output or the likely failure.
4. Run the narrowest relevant command.
5. Kevin explains the result in his own words.
6. Apply the smallest requirement-aligned improvement and add bounded tests.
7. Record exact evidence, limitations, assistance level, and the next review date.

Passing an automated checker, reaching 100%, or creating a commit does not by
itself establish `explained` or `mastered`.

## Frictionless own-words queue

Use the local standard-library intake tool instead of copying authenticated
course text:

```powershell
# One exercise, interactively previewed before it is written.
npm run intake -- add

# Many current or future exercises through an ignored local batch file.
npm run intake -- template
npm run intake -- import .private/intake/kevin-batch.json
npm run intake -- import .private/intake/kevin-batch.json --apply

# Read the next item and validate the public queue.
npm run intake -- next
npm run intake:check
```

The tracked [public-safe queue](intake/queue.json) contains only Kevin-authored
planning summaries with forced `unverified` requirement fidelity and `unknown`
learning state. It intentionally omits Octopus progress, mandatory/optional
classification, prompts, tests, quiz data, attempts, submissions, grades,
private titles, internal identifiers, and authenticated URLs. The complete
one-screen workflow is in [`.learning/intake/README.md`](intake/README.md).

For Weeks 7–12, intake cannot predeclare a day or exercise path. Select one
item, review the independently written summary, and only then justify a stable
repository location. The tool never creates curriculum code or folders.

## Profile audit before editing

Inspect every available field before proposing a change:

```text
field
current_value_private
proposed_value
evidence
visibility
sensitivity
editable
save_requires_approval
```

Truthful professional direction:

- official/student name: **Kevin Cusnir**;
- creative identity: **Lirioth Teltanion** only in an optional bio or portfolio line;
- headline proposal: `Junior Full-Stack Developer | Python, JavaScript & TypeScript | Accessible Web + Automation`;
- represent React, Redux, authentication, and final-project delivery as in progress;
- link only verified public GitHub, portfolio, LinkedIn, or demo destinations;
- do not claim seniority, employment, certifications, users, metrics, awards, or mastery without evidence.

Proposed bio, pending field-length and visibility review:

> Junior full-stack developer in Be'er Sheva, Israel. My current coursework and
> projects include Python, JavaScript, TypeScript, SQL, and Node.js, with React,
> Redux, authentication, and final-project work in progress. I focus on
> accessible multilingual interfaces, reproducible testing, clear documentation,
> and responsible AI-assisted development. I publish source-backed work and
> honest project evidence at github.com/LiriothTeltanion.

Before any profile Save action:

- verify who can see the field;
- keep telephone, personal email, exact address, schedules, and financial data private;
- inspect AI Job Board and CV visibility separately;
- verify every public link;
- remove image EXIF/location metadata before an avatar upload;
- present the exact before/after diff to Kevin;
- obtain explicit approval for the specific Save action.

## Current source-safe done criteria

- Existing private captures are frozen and integrity-hashed.
- Git indexes zero private Octopus files.
- Public files contain no course prompts, screenshots, internal identifiers,
  personal contact values, or protected course assets.
- The next task comes from Kevin's own summary or explicitly authorized material.
- AI assistance is disclosed and never represented as Kevin's mastery.
- No submission, enrollment, message, upload, or profile change occurs without
  a separate, exact approval.
