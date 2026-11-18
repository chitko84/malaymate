# MalayMate frontend feature catalogue

## React adventure upgrade

The primary interface is now React + TypeScript. Welcome and home use a raised Malaysia map filled with flag colours. The solo game now uses an illustrated Malaysia map rather than a grid of level cards. Nine numbered learning stops connect Peninsular Malaysia with Sarawak and Sabah. Selecting a stop shows its city, topic, stars and play action. Locked stops explain their prerequisite. Next-stop navigation, map dragging/swiping, zoom and arrow-key navigation are supported. The existing level IDs preserve saved progress. The game area adds nine sequential 3D levels, stars, unlocks, saved solo records, real two-player rooms and a server leaderboard. See README for controls, source architecture and boundaries. Existing lesson/admin tools remain available through the embedded feature panel. The adventure question set is fixed separately from the older admin phrase editor. The old service worker is no longer registered.

The application contains only student and administrator workflows. There is no supervisor review role or page.

| Area | Screens and behaviour |
| --- | --- |
| Accounts | Student sign-in/registration, full name, email, optional student ID/nationality, password confirmation, required-field validation, duplicate email and suspended state, sign-out, editable profile and goal. New students start with empty progress. Each account's learning state is retained separately on this device. |
| Placement | Instructions, mixed question types, question navigation, answers retained within an active attempt, submission confirmation, score and level, timestamps and configurable retake interval. Initial bands: below 40% Foundation; 40–74% Everyday; 75–100% Connections. Placement suggests a starting point; all published lessons remain browsable. |
| Learning path | Foundation, Everyday and Connections levels; nine topic cards; progress percentages; ordered lessons; published-content filtering; last access; resume section; per-lesson completion. Default completion requires all three activity sections and a passing lesson check. |
| Lesson activities | Malay/English flashcards, vocabulary lists, recording/voice controls, speed selection, visible transcripts, topic-specific four-line dialogues, word-order tokens, remove/clear actions and correct/incorrect feedback. Each lesson selects its target phrase using lesson order. |
| Assessments | Placement, practice, quiz and review; choice/listening/written/word-order answers; previous/next navigation; missing-answer validation; submission confirmation; automatic configured-point marking; normalised case/punctuation/whitespace for exact written answers. |
| Results | Percentage, points, pass or practice state, placement level, lesson completion, reward summary, level-up state, newly earned badges, saved answers, expected answers, explanations, timing and next actions. Historical attempts retain response evidence. |
| Phrasebook | Published entries, Malay and English search, language direction, category filter, no-result state, translations, examples, optional pronunciation guide, audio and linked lesson/concept. Admin changes appear immediately in student views. |
| Personalised review | Topics below the pass threshold, priority sorting, triggering score, reason, suggested activity and linked lesson. A successful latest review removes the topic from pending recommendations. ML response examples are explicitly illustrative. |
| Progress | Learning-path completion, latest topic assessment, secure/developing/needs-practice states, correct-response concept evidence, completed lessons, assessment history and answer review. Placement is excluded from topic-score mastery. |
| Feedback | 1–5 rating, optional comment, learner identity/date, submission confirmation, own feedback history; administrator New, In review and Resolved statuses. |
| Admin overview | Accounts, published content, saved assessments, new feedback, recent activity and adaptive insight links. |
| Students | Name/email/student-ID search, account-status filter, XP and lesson/assessment summary, individual attempts, suspend/reactivate confirmation and sign-in enforcement in the local simulation. |
| Content studio | Levels/modules/lessons with order and publication; phrases and categories; lesson/concept links; examples, pronunciation guides and local audio attachments; validation of parent links; dependent-record deletion checks. |
| Assessment studio | Definition creation/edit/publication, pass mark, associated module/lesson, question editor for four types, options, answer, transcript, concept, explanation and point values, add/remove questions and scored preview. Current question banks are shared by topic and their assessment types; production ownership should be normalized. |
| Analytics | Student/level/module/type filters, matching attempt counts, average score, response counts, review counts, topic averages, recent score chart, history and filtered CSV download. |
| Adaptive insights | Source and scenario, trigger attempt, latest score, priority, reason, recommended lesson, illustrative model fields and proposed service contract. No trained inference is performed. |
| Settings | Placement bands/retake days, pass/mastery percentages, lesson completion condition, XP amounts, badge definitions/conditions/targets/activation and local-data reset. |
| Devices | Responsive desktop/tablet/mobile layout, mobile navigation, hidden navigation removed from keyboard access, skip link, visible focus, modal keyboard trap, reduced-motion support, PWA manifest/install guidance and cached app files. These are implementations, not a conformance certification. |

## New first-time experience and games

The redesigned welcome page states what MalayMate teaches and offers Start learning or Try a learning game. Get started offers a first lesson, a level check or a game. A reusable help dialog explains Learn, Games, Practice and Rewards; XP is explained as learning points. Student navigation uses simple labels.

**Word Match:** select a Malay phrase and its English meaning, in either column order. Correct pairs stay matched. Incorrect pairs show a friendly retry message. A hint reveals one unmatched pair. All pairs must be found to finish.

**Sentence Shuffle:** read the English meaning, choose shuffled Malay word tokens, remove/clear choices, check the order and advance through each round. A hint reveals the first word. All rounds must be completed.

Both games offer topic selection and quick/longer play, use published phrases only, and show instructions before play. Game score starts at 100, with 10 deducted per mistake and 5 per hint, down to zero. There is no timer; duration is recorded separately. Finishing awards 15 XP once per game type/topic/day. Replays are scored and saved without duplicate daily XP. Game scores are separate from quiz mastery and placement. New game badges unlock at one and five completed games.

## Nine learning topics

Greetings and introductions; campus communication; food and ordering; numbers and shopping; directions and transport; healthcare; social interaction; community engagement; internship and workplace.

## Gamification details

| Feature | Behaviour |
| --- | --- |
| XP ledger | Each event has a key, reward amount, label and Malaysia date. The total is derived from the ledger. Replaying the same event cannot duplicate XP. |
| Completion reward | Initially 20 XP once per completed lesson. |
| Assessment reward | Initially 10 XP, once per topic/type/day. Reviews initially earn 15 XP with the same daily qualification rule. |
| XP levels | 100 XP per level, six initial title labels; numerical levels continue after the final label. This is independent of the placement learning level. |
| Daily goals | Choose 20, 30 or 50 XP; display today's total and goal progress. All earned XP counts, including quest rewards. |
| Daily quests | Complete one lesson: +10 XP; answer five questions correctly: +15 XP; complete one personalised review: +10 XP; finish one learning game: +10 XP. Claim buttons appear only after the condition is met, then become Claimed. Quest claim identity includes the date. |
| Streaks | A lesson or assessment reward activity marks the Malaysia day. Multiple activities on one day cannot increase the streak twice. An elapsed missing day breaks the current streak; longest streak is retained. |
| Badges | Twelve initial definitions: first lesson, 50 XP, 200 XP, 3-day streak, 5 lessons, perfect score, 3 reviews, one full module, 7-day streak 500 XP, first game and five games. Each displays earned/locked state, progress and detail. |
| Badge management | Administrator can create/edit/activate/deactivate; conditions include XP, lesson count, streak days, assessment count, perfect assessments, review count and complete module count and game count. Existing earned badges are not repeatedly issued. |
| Celebrations | Assessment result shows new XP, any new badges and level-up state. Animations honour reduced-motion preferences. |

This is a complete browser frontend for these workflows. Server-side SRS requirements remain backend work; see BACKEND_INTEGRATION.md.

## In-world portal game upgrade

Solo and multiplayer now use an immersive shared arena component. The separate question panel, bottom answer cards and walk-through button are removed. Students read a compact mission, move with WASD/arrows or the touch pad, click the path to walk, jump, and enter one of three word portals. Portal signs and the 3D portal meshes are directly clickable. The explorer walks into the chosen portal before an answer is marked. Opening portal curtains, animated coins, particle bursts, correct-answer combinations and opt-in generated sound effects provide feedback. The game includes pause/help, desktop full-screen control and keyboard-accessible portal signs. A mistaken answer shows the expected phrase without a countdown.

Twelve trail coins can be collected during an adventure. These are cosmetic run collectibles, reset on replay and do not alter learning XP, game points or online ranking. Existing 100-point correct-answer scoring, three-of-four passing, stars, first-pass XP and map unlocking are preserved. Both real multiplayer clients use the same arena; the server still marks answers and the leaderboard still ranks completed rounds.
