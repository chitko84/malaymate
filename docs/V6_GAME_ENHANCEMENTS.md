# MalayMate v6 — Game Arcade & Campus Quest Enhancement

**Release basis:** The user's MalayMate v5 source ZIP. v6 changes the existing app in place. The original nine-stop Malaysia adventure, multiplayer room API, story, adaptive review, classic lessons and classic mini-games remain in the source.

## New features delivered in source

### 1. Dedicated Game Arcade (`#arcade`)

Three new React games are accessible from the sidebar, Play & Explore and student dashboard:

| Game | Mechanic | Scoring | Learner model |
| --- | --- | --- | --- |
| Memory Match | Flip six cards, match three Malay phrases with their English meanings. Mismatches briefly reveal both cards before hiding. | Starts at 100; -12 per wrong pair attempt (minimum 0). | Records newly identified mismatches and successful matching by topic. |
| Sentence Studio | Build 3–4 Malay sentences by selecting rearranged word tokens, with reset and first-word hints. Wrong answers can be corrected before continuing. | Percentage correct on the **first independent attempt**. A successful correction or hint is valuable practice but does not earn first-try points. | Records first incorrect attempt, or correctly constructed phrase; assisted correct answers are recorded as assisted/incorrect evidence for estimated independent mastery. |
| Listening Lab | Hear browser-generated Malay speech, replay as often as needed, choose among three English meanings, and view bilingual feedback. | Percentage correct on first attempt. | Records correct/wrong comprehension by topic. |

The Listening Lab only enables the answer choices after the learner presses Play Audio, where speech synthesis exists. If speech synthesis is absent, a clearly identified **text-practice fallback** displays the Malay text; this is not equivalent to a listening-comprehension test. Speech synthesis requires a suitable browser voice and should be checked on target devices. **No recorded native-speaker audio is bundled.**

### 2. Larger reusable content bank

`src/arcade-data.ts` pulls the 24 existing correct story responses plus **64 supplementary everyday phrases**, eight per chapter. In total, **88 unique Malay–English phrase pairs** are available as the learner unlocks all eight chapters; the first chapter starts with eleven. Source items are grouped by topic; the next round favours previously missed phrases and lower-mastery skills and shuffles among similarly prioritised items. There are no hard-coded new learner answer keys in the UI. Additional curated phrase sets can be appended to `ARCADE_EXTRA` without changing the game component.

**Curriculum boundary:** these extra phrases are a development draft, not a 90-day teacher-validated syllabus. A Bahasa Melayu specialist should validate grammar, naturalness, pronunciation and difficulty sequencing before evaluation with students.

### 3. Daily Triple Quest & replay rewards

All three arcade games can be finished in any order. Today is interpreted in the existing **Asia/Kuala_Lumpur** day key. Rewards are recorded in the existing XP event store using de-duplication keys:

- **15 XP** once per game per Malaysia day for a score of at least 60%.
- **25 XP** once per Malaysia day after playing all three modes.
- Replays remain available; best scores, play counts and daily history are stored per preview profile in the story record.
- The Triple Quest grants its completion bonus after three plays, even if one scored below 60%; score-based individual rewards are separate.

The arcade does not alter multiplayer leaderboard points or solo adventure star rankings. These are learning-game XP rewards only.

### 4. Campus Quest — nine conversation turns, not three isolated questions

`src/campus-data.ts` provides **three three-turn NPC missions**, each with feedback, translation and a learning hint:

1. **The Library Trail** — ask where the library is, follow a left turn, ask a polite question (Farid).
2. **Lunch-Time Challenge** — request water, order fried rice, ask for non-spicy food (Kak Mira).
3. **A New Campus Friend** — invite Aina, reply to thanks and say goodbye (Aina).

Answering **at least two of three** questions completes a mission. Outcomes update topic-specific learner mastery. Runs can be replayed for practice, and each mission's best score and number of attempts are saved. Existing one-time XP policies are retained: **25 XP for each first successful mission, and 50 XP for completing all three (maximum 125 XP)**.

The underlying Three.js environment now has campus labels, glowing activity markers, plaza details, gardens, benches, lamp posts, a nearby-NPC prompt and on-screen touch movement controls. Keyboard navigation (WASD/arrows, E near NPC), clickable characters, and accessible mission cards remain available. These models are illustrative rather than accurate AIU building geometries. A WebGL fallback continues to provide mission card access when 3D cannot render.

### 5. Backward-compatible storage

`src/adaptive.ts` extends `StoryProgress` version 1 with `arcade`, `arcadeRuns`, and optional campus `bestScore`. The validator safely initializes those new fields when importing pre-v6 story JSON. Existing story, XP, chapter and campus completion records are not cleared. Downloads from My Story now include arcade records; this does not back up the separate classic account, XP and adventure stores.

## How to run

From the extracted `MalayMate_Frontend` folder:

```bash
npm ci
npm run dev
```

Use Node.js **22 or newer**. Open the Vite local address, then select **Game Arcade** in the sidebar or choose Play & Explore → Open Game Arcade. Select **3D Campus Quest** to try the expanded NPC missions. For a complete check after dependencies are installed, use:

```bash
npm test
npm run build
```

## Validation performed for this release

**Passed:**

- `scripts/check.mjs`: classic lessons, games, XP, and UI rendering regression checks.
- Original `scripts/story-tests.ts`: story unlock rules, mastery updates, backup validation and learner isolation.
- New `scripts/arcade-tests.ts`: 88 unique phrases, locked-topic gating, three game setup types, unique cards, word tiles, date-specific progress, backward-compatible storage and nine NPC steps.
- Original `scripts/adventure-tests.ts`: solo stages, map, multiplayer API, duplicate answers, coins/movement helpers and leaderboard rules.
- Strict TypeScript type checking of the **pure data/model modules** (`adaptive.ts`, `arcade-data.ts`, `campus-data.ts`, `story-data.ts`).
- Syntax/transpilation checks for all 28 project TypeScript/TSX files.

The TS tests were run through local TypeScript-to-ESM conversion because external `tsx` dependencies could not be installed. This verifies tested logic, not the bundler or UI behaviour.

**Not verified in this environment:** installation of npm dependencies, `npm run build`, full React TypeScript package checks, browser gameplay rendering/interaction, mobile-device performance, text-to-speech quality or hosted Cloudflare multiplayer connectivity. These require a development machine with package access and browser/device QA. Do not claim the v6 frontend was fully built/deployed from these test results.

## Remaining FYP implementation scope

- Secure, server-backed authentication, validated roles, persistent MySQL/Laravel (or documented alternative) learner data and API-driven content.
- Authoritative content-management integration so admin edits affect both story and games.
- A native-/expert-reviewed 90-day Malay curriculum with enough activity types and difficulty scaling for 3-month engagement.
- Teacher-reviewed pronunciation/audio and actual listening/speaking evaluation. Browser speech synthesis is not an assessment of pronunciation.
- Real learner evidence, calibrated/trained ML baseline, controlled evaluation, results and statistical comparison.
- Comprehensive accessibility, E2E, browser, security and usability testing; production deployment and monitoring.

**Important:** BKT is an online probabilistic learner model configured with fixed priors, *not* an empirically trained model or validated proficiency score. Core student data remains in localStorage and demo login cannot secure real students.
