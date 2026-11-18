# MalayMate v6 — Enhanced Games & Connected Learning

> **November 2026 game enhancement:** v6 builds directly on MalayMate v5. It adds the **Game Arcade** (Memory Match, Sentence Studio, Listening Lab), **88 curated-in-source phrase pairs across eight chapters**, daily Triple Quest rewards and a much richer **three-mission, nine-turn 3D Campus Quest** with touchscreen movement, live NPC prompts and improved campus detail. The original nine-stop adventure, two-player multiplayer, classic games, story chapters, adaptive review and admin preview are retained.
>
> This is an FYP frontend prototype: core student records still use browser-local storage, speech depends on the browser and Bayesian Knowledge Tracing uses fixed parameters rather than a validated trained model. **The v6 React build and browser testing were not verified in this environment.** See [`docs/V6_GAME_ENHANCEMENTS.md`](docs/V6_GAME_ENHANCEMENTS.md) and the earlier [`docs/V5_IMPLEMENTATION.md`](docs/V5_IMPLEMENTATION.md).

## Start the upgraded project

```bash
npm ci
npm run dev
```

Use Node.js 22+. Open the local Vite URL, then choose **Game Arcade** or **3D Campus Quest** from the sidebar. After dependencies are available, verify with `npm test` and `npm run build`. The existing classic games remain accessible through the `#quickgames` route.

---

# MalayMate — React & TypeScript learning adventure

A polished Malay learning frontend for international students, with a Malaysian flag map hero, a guided learning space, nine solo 3D levels and real two-player rooms. The supervisor review page remains removed. The eight-chapter interactive story and Campus Quest now sit alongside the retained nine-destination map.

## Run locally

Use Node.js 22 or newer and Python 3 for ZIP packaging.

```sh
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173). For multiplayer, open a second browser tab, create a room in one tab and join its six-character code in the other. Each tab has its own room session. The local room service uses memory: restarting Vite clears rooms and the local online leaderboard.

```sh
npm test          # core learning and multiplayer checks
npm run build    # typecheck, React build, Worker bundle
npm run package  # recreate public/MalayMate_Frontend_Project.zip
```

The hosted edition uses a Cloudflare Worker with a D1 database. `db/schema.ts` and the committed `drizzle/` migrations define its tables. A D1 binding named `DB` is required for rooms and the leaderboard. Apply migrations during deployment, not from request handlers. The source ZIP excludes hosting identity and credentials. `npm run build` also works outside hosted Sites; if no hosting manifest exists, the build simply omits that metadata. To use another host, serve the Vite client and route `/api/*` to an implementation of `server/api.ts`; static hosting alone cannot provide online rooms.

## Included features

| Area | Delivered behaviour |
| --- | --- |
| Design | Responsive purple, cream and mint theme; raised Malaysia map filled with flag artwork; simple labels, welcome steps and help |
| Solo 3D | Interactive Malaysia map with nine numbered stops, connected trails, locked/completed markers, saved stars, next-stop navigation, keyboard navigation and zoom. Nine sequential destinations, four in-world word portals each, free movement with WASD/arrows, click-to-walk, touch movement pad, jumping, collectible trail coins, optional sound effects, pause/help/full-screen controls and bilingual feedback, results, replay, saved best scores and stars |
| Unlocking | Pass at least three of four gates; first pass awards 30 XP once per level; up to 27 stars |
| Online multiplayer | Two real players, create/join codes, display names, destination selection, ready checks, host start, live progress, server scoring, leave handling, 20-minute expiry, session resume |
| Leaderboard | Top 20 completed multiplayer rounds from the server; correct answer earns 100 points; no invented opponents or scores; solo records shown separately |
| Game Arcade (v6) | Three new adaptive React games: Memory Match, Sentence Studio and Listening Lab, powered by 88 story-linked phrase pairs, daily mode rewards and saved best scores |
| Campus Quest (v6) | Three NPC missions with three connected conversations each, touch movement, in-world signboards, progress stars and one-time mission XP |
| 3D world | Three.js geometry, moving avatar, three directly clickable word portals with opening curtains, trees, kampung houses, Malaysian flags and a stylised KL skyline; destination colours and prompts change across the nine levels |
| Compatibility | CPU projection of the same 3D scene when WebGL is unavailable; readable answer buttons remain available |
| Learning | Three levels, nine topics, 27 lessons, vocabulary, flashcards, contextual dialogue, sentence building and pronunciation support |
| Assessments | Placement, practice, quiz and personalised review, explanations, saved response evidence and results |
| Student support | Phrasebook search/filters, profile, feedback, topic mastery, progress history, XP, streaks, daily goals, badges and two quick games |
| Administrator | Student management, publication/content editors, assessments/questions, filtered analytics/export, learning insights, feedback and policy/badge settings |

## Source structure

- `src/`: primary React/TypeScript app, routing, map hero, interactive campaign map, 3D world, solo levels and multiplayer UI. `CampaignMap.tsx`, `map-stops.ts`, `malaysia-outline.json` and `campaign-map.css` implement the map. Country shapes derive from public-domain Natural Earth data; see `docs/MAP_SOURCES.md`.
- `public/classic/`: retained, functional JavaScript lesson, assessment and admin tools displayed inside a same-origin embedded panel. This preserves the existing feature set; it is not a claim that every older component has been rewritten in React.
- `public/assets/malaysia-flag-map.png`: generated decorative hero artwork inspired by the user's map reference. Small UI flags and flags within the 3D world use drawn flag graphics.
- `server/api.ts`: shared room API, optimistic concurrency, hashed session tokens, answer marking and leaderboard adapter.
- `server/worker.ts`: hosted API and client asset delivery.
- `db/`, `drizzle/`: D1 schema and versioned migrations.
- `scripts/`: build, regression tests and portable source ZIP creation.
- `docs/`: feature catalogue, design decisions and backend integration map.

## Preview accounts

| Account | Email | Password |
| --- | --- | --- |
| Student | student@malaymate.demo | demo1234 |
| Administrator | admin@malaymate.demo | demo1234 |
| Suspended student | suspended@malaymate.demo | demo1234 |

Registration demonstrates validation and a separate local student profile. Passwords are not stored; later demonstration sign-ins use `demo1234`. The administrator preview control is intentionally accessible for reviewing the frontend.

## Important boundaries

The primary app and the retained learning tools share browser-local learning records. These are fictional starter records; individual accounts, core lessons, assessments and XP are not synchronized across devices. Core account authentication and admin role controls remain a frontend demonstration. Production Laravel/MySQL integration, secure learner identity, password recovery, durable media storage and a trained Python/FastAPI ML service remain separate work.

Online multiplayer is implemented with a real room API and durable hosted D1 records. It uses anonymous, short-lived room tokens, not production student authentication. The leaderboard ranks completed rounds, not lifetime student XP. Content is a fixed beginner question set bundled with the adventure, independent of the administrator's older phrase editor; it is not cheat-resistant or a validated proficiency assessment. Rooms expire logically after 20 minutes; this does not delete stored rows. A production release should add authenticated accounts, rate limits, cleanup and moderation.

A friend needs permission to visit the private hosted preview before they can join a room. A room code does not grant site access. Site sharing has not been expanded.

The separate question-and-answer panel below the game has been removed in solo and multiplayer. A compact mission bubble and interactive portal signs inside the scene provide the learning challenge. Trail coins reset with each adventure and do not change XP or leaderboard scores. Opponent avatars show their checkpoint progress; continuous remote movement is not synchronized. See `docs/GAME_DESIGN.md`.

The nine solo destinations share a stylised world design with different content, titles and colours. Pronunciation in the retained lessons uses uploaded local audio or an installed Malay speech voice; no verified audio library is bundled. Game prompts remain readable without audio. Language content and decorative map artwork should be reviewed before public educational use.

The old service worker is no longer registered. This release does not claim offline multiplayer or a newly tested installable PWA.

## Validation

Automated checks cover retained learning screens and reward logic, per-learner records, nine levels, stars, replay XP, room tokens, capacity, ready/start checks, concurrent updates, duplicate answer prevention, scores, expiry and leaderboard de-duplication. The full React TypeScript build must be checked separately on a system with npm dependencies installed. Browser QA covers the new map, compatibility-rendered 3D scene, a complete solo level, two-player joining/ready/start, map stop selection, locked-stop instructions, zoom, next-stop selection and launching the matching game. The portal upgrade was checked through a complete solo round (including wrong-answer feedback, 300 points, two stars and 30 XP), a full two-player round (400 versus 300 points), mobile portal interaction and pause controls. WebGL hardware rendering and cross-device performance require testing on real target devices.
