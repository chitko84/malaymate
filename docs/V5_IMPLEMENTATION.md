# AIU MalayMate v5 — Implementation and handover

**Release:** 18 November 2026 · **Scope:** functional learning-experience upgrade to the supplied React/TypeScript prototype. It is **not** a claim of production-ready authentication, cross-device persistence, or academically validated ML proficiency.

## 1. What was added

| Component | Files | Behaviour |
| --- | --- | --- |
| Eight connected chapters | `src/story-data.ts`, `src/StoryJourney.tsx`, `src/story.css` | Eight chapters in a coherent AIU student storyline, three interactive choice-based conversations per chapter (24 total), consistent recurring characters, learning goals, Malay dialogue with explanations and contextual feedback; 2/3 required to unlock next chapter. |
| Adaptive learner model | `src/adaptive.ts` | Online Bayesian Knowledge Tracing (BKT) mastery updates after correct/wrong responses; transparency about priors; lower-mastery chapter recommendation; error-aware question selection. |
| Adaptive review | `src/AdaptiveReview.tsx`, `src/story.css` | Up to five targeted questions across *unlocked* chapters; mistakes and weak skills first, corrective feedback, optional Malay speech synthesis, 15 daily XP when >=80% correct. |
| Campus Quest | `src/CampusQuest.tsx`, `src/campus-quest.css` | Procedural Three.js AIU-inspired campus; move with WASD/arrows, interact with NPCs via mouse or E nearby, or select mission cards; library, cafeteria and student centre missions; feedback, retry, per-mission progress; 25 XP per first successful mission + 50 XP once for all three. |
| Shared learning analytics | `src/Adventure.tsx` | Original 3D adventure answers update the same per-skill mastery estimates for its first eight topics. Ninth `workplace` level remains as an independent bonus destination, outside eight-chapter BKT. |
| User-controlled progress | `src/adaptive.ts`, `src/StoryJourney.tsx` | Per-preview-profile browser-local story records; downloadable JSON backup, strict version/structure checks on import, optional restore confirmation. No passwords in backup. |
| App integration | `src/App.tsx`, `src/types.ts`, `src/styles.css` | New sidebar navigation for story mode, adaptive practice and campus quest; dashboard and games hub links. Legacy learning, solo nine-destination game, and multiplayer remain present. |
| Asset hygiene | `public/manifest.webmanifest`, `public/classic/index.html`, `index.html` | Shared absolute icon and web-manifest paths; removed in-app source ZIP link that was broken before packaging. Not an offline-support claim. |
| Tests | `scripts/story-tests.ts`, `package.json` | Checks story completeness, answer uniqueness, learner model, unlocking, review queue, per-profile persistence, backup validation, and XP compatibility. Existing tests preserved. |

## 2. Where to start

```bash
npm ci
npm run dev
```

Use Node.js 22+. Open the URL shown by Vite and enter the preview as a student. Navigation:

1. **My story**: start with Chapter 1, choose the Malay response, read the character's feedback, continue through all three scenes, and score at least 2/3 to unlock Chapter 2.
2. **Adaptive practice**: automatically sample questions from unlocked chapters, prioritising previous mistakes and lower mastery. Early in the journey, there may be only three available questions; later up to five.
3. **3D Campus Quest**: click on NPCs, move around the campus with WASD/arrows and press E near a character, or use the accessible mission cards. Finish all three missions for the one-time completion bonus.
4. **Play & explore**: the prior nine-level Malaysian world and two-player rooms remain available. Answers from the first eight solo topics now influence the story mastery model.
5. **My story → Export story progress**: save only your storyline, mastery and campus quest records as JSON. Import them from the same page after switching browsers or machines; existing lesson XP, multiplayer records and classic learning data are not included.

The preview's existing login, admin tools and learning panel are retained as they were. They are **not secure production identity controls**.

## 3. Curriculum: one story with eight chapters

| # | Chapter | Location | Core skill |
| - | --- | --- | --- |
| 1 | A New Beginning | AIU Arrival Hall | Greetings and self-introduction |
| 2 | Find Your Way | AIU Learning Centre | Campus facilities and asking for help |
| 3 | Makan Time! | Campus Cafeteria | Ordering food and drinks |
| 4 | Market Mission | Alor Setar Market | Prices and purchases |
| 5 | The Bus Challenge | Alor Setar Bus Stop | Travel and directions |
| 6 | Help a Friend | AIU Health Centre | Symptoms and assistance |
| 7 | New Friends, New Words | AIU Student Lounge | Invitations, responses and farewells |
| 8 | Together at AIU | AIU Community Garden | Helping and collaborating |

Every conversation has one correct answer, two plausible distractors, contextual positive and corrective branches, a learning hint and Malay/English explanations. English option translations are **not** shown before a learner answers; they appear with feedback. The three campus quests are available independently as a supplementary activity.

## 4. How adaptivity actually works

The project uses a transparent online **Bayesian Knowledge Tracing** (BKT) model. Starting assumptions are deliberately exposed in `src/adaptive.ts`:

- Initial knowledge probability `P(L0)=0.22`
- Learning transition `P(T)=0.14`
- Guess probability `P(G)=0.25`
- Slip probability `P(S)=0.10`

On every new answer, the system first estimates the probability that the learner knew the concept given whether the answer was correct; it then applies the learning transition to estimate knowledge after that opportunity. It stores mastery, attempt counts, correct counts, last interaction time, and recent mistaken item IDs for each of the eight skills. A chapter whose estimated mastery is below 72% is a priority for review (if the chapter is unlocked). Targeted practice prioritises mistaken items and lower-mastery topics. **These parameters are preset; they were not fitted to a learner dataset. Mastery is an estimate, not a clinical or academic language-proficiency measurement.**

For a credible thesis evaluation, obtain appropriate ethical consent and interaction data, estimate/calibrate parameters, compare the adaptive policy against a nonadaptive baseline, and report both learning outcome and usability metrics.

## 5. Storage and security

- The preexisting classic lesson/user/XP system still uses `malaymate-w3-v1` in localStorage.
- The new story/quest/skill model stores `malaymate-story-v1:<profile-hash>` in localStorage. The key is scoped to the email of the **active classic preview profile** when available; records do not normally mix between demo learners. The hash is for key namespacing, **not security**, and data can be read or changed by a user with browser access.
- A validated export has the outer structure `{ app: "MalayMate", type: "learning-progress", exportedAt, story }`. Import is limited to 500 KiB, validates the supported `version:1` structure, prompts before overwrite, and cannot execute code.
- XP earned through story, reviews and quests is added via the **existing** `updateState` / `reward` functions and deduplicated by award key. A first chapter pass awards 40 XP, each first 3D campus mission awards 25 XP, finishing the whole campus awards 50 XP, and the review bonus awards 15 XP at most once per Malaysia date. These rewards do not alter the multiplayer ranking.
- **Do not use preview accounts for real student data or deploy the admin preview publicly as secure software.** Real user registration, authorization, persistent storage, password management, consent management, audit logs, and role restrictions are still needed.
- The 3D campus is a stylised learning environment, not an accurate measured 3D model of AIU.

## 6. Validation conducted for this release

Passed in the file-review environment:

- `scripts/check.mjs` — original JavaScript classroom/assessment/reward regression tests.
- `scripts/adventure-tests.ts` — original adventure, map, game motion, multiplayer room, score and duplicate-XP logic tests (executed through TypeScript-to-ESM conversion using a local compiler because `tsx` could not be installed).
- `scripts/story-tests.ts` — new eight-chapter content, BKT updates, unlock rules, review queue, learner isolation, exports and campus progress tests.
- Source syntax/transpilation checks for all modified TS/TSX files using the available global TypeScript compiler.

**Not verified:** `npm ci` did not complete because external package downloads were unavailable; therefore `npm run build` and real-browser tests of the new React/Three.js pages have **not** been completed in this environment. Run these locally on a computer with npm access, verify WebGL and fallback rendering, mobile layout, login/profile switching, narration voice availability, keyboard accessibility, and accessibility contrast.

## 7. Remaining milestones before claiming a complete FYP

1. Production-grade authentication and role-based access, with a proper backend (e.g. Laravel/MySQL, or another stack documented in the design specification).
2. Authoritative learner profiles, lessons, assessments and story progress with cross-device database sync, API validation, appropriate encryption and data-retention controls.
3. Empirically evaluated adaptive learning: consented data collection, parameter calibration or trained ML baseline, offline validation, comparisons to fixed-order learning, meaningful outcomes and limitations.
4. Content validation with native/qualified Bahasa Melayu educators; record corrections and pronunciation checks.
5. Integration of administrator-edited lesson content into story/3D question banks (currently curated in TypeScript), plus role-restricted content-management workflow.
6. End-to-end browser, load, accessibility and security testing; deploy and monitor multiplayer D1 API and application backend.
7. Document the implementation, datasets, architecture, evaluation protocol, screenshots and user acceptance testing in the FYP report.

The release is a **substantial functional frontend enhancement** with working local learning logic, not a statement that those production and research milestones have been met.
