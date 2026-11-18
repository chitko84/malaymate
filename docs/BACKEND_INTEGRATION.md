# Backend integration map

## Implemented multiplayer service

`server/api.ts` implements POST `/api/rooms/create`, `/join`, `/ready`, `/start`, `/answer`, `/sync` and `/leave`, and GET `/api/leaderboard`. The hosted Worker uses D1 tables `multiplayer_rooms` and `multiplayer_results` from committed Drizzle migrations. The local Vite server uses an in-memory adapter for the same API. Room changes use optimistic compare-and-swap updates; results have unique identifiers to avoid duplicate rows. Tokens are randomly generated and only their SHA-256 hashes are stored server-side. Two players are supported per room; only a ready host can start after both are ready. Scores are marked server-side from the fixed adventure question set. Rooms expire after 20 minutes.

This service is separate from production student identity. Integrate it with authenticated learners, rate limiting, moderation, cleanup and approved content before public release. Solo game XP remains local. The leaderboard ranks completed multiplayer rounds rather than lifetime XP.

## Core learning backend still to integrate

The delivered project includes frontend source. The current data adapter uses localStorage and a mock role session. The production plan from the FYP report is Laravel/MySQL with a Python/FastAPI/scikit-learn adaptive service.

## Suggested endpoint map

These paths are proposals for implementation, not existing connected endpoints.

| Workflow | Suggested endpoints | Server responsibility |
| --- | --- | --- |
| Accounts | POST /api/register; POST /api/login; POST /api/logout; GET/PATCH /api/me | Real credentials, password hashes, validation, sessions, CSRF, authorization and suspension. |
| Learning | GET /api/levels; GET /api/modules; GET /api/modules/{id}/lessons; GET /api/lessons/{id}; PATCH /api/lessons/{id}/progress | Published ancestry, ordering, learner-owned progress, access/resume and approved completion conditions. |
| Phrasebook | GET /api/phrasebook?q=&language=&category= | Bilingual search, pagination, public content/media and publication filters. |
| Placement | GET /api/placement/eligibility; POST /api/placement/attempts | Retake policy, test order, server-side scoring and assigned level. |
| Assessments | POST /api/assessments/{id}/attempts; PATCH /api/attempts/{id}/answers; POST /api/attempts/{id}/submit; GET /api/attempts/{id} | Active attempt state, correct-question ownership, scoring, accepted written variants, timestamps and atomic submission. Correct answers must not ship in the active test payload. |
| Progress | GET /api/me/progress; GET /api/me/attempts | Completion, concept mastery policy, latest topic evidence and history. |
| Recommendations | GET /api/me/recommendations; POST /api/recommendations/{id}/review | Validated features, learner/trigger links, model version, reason, priority, status changes and review history. |
| ML service | POST /predict | FastAPI validates feature JSON, loads an evaluated model and returns weak topic, probability/priority, recommendation reason and model version. Laravel owns persistence and authorization. |
| Rewards | GET /api/me/rewards; POST /api/quests/{id}/claim | Atomic XP ledger, unique keys, eligibility, once-per-day policies, Malaysia calendar boundaries, longest streak and unique user/badge constraints. |
| Feedback | GET/POST /api/me/feedback; PATCH /api/admin/feedback/{id} | Rating validation, learner identity and administrator review status. |
| Administration | /api/admin/users; /api/admin/levels; /api/admin/modules; /api/admin/lessons; /api/admin/phrases; /api/admin/assessments; /api/admin/questions; /api/admin/badges | Enforced admin role, relationship validation, publication, durable audio uploads, deletion policy and audit. |
| Analytics | GET /api/admin/analytics?student=&level=&module=&type=; GET /api/admin/analytics/export | Approved aggregation, authorized record access, filtered export and appropriate privacy controls. |
| Policy | GET/PATCH /api/admin/settings | Validated scoring, placement, completion, XP and versioned policy. |

## Game integration

Add authenticated game-start and game-submit endpoints and a GameAttempts table. Validate the published phrase set and answer sequence on the server, apply idempotent reward keys and retain game result history separately from placement and scored assessments. The frontend currently saves gameHistory per learner and computes scores locally; replace this with returned server results. Do not use game score as validated language proficiency or ML evidence without a defined evaluation policy.

## Frontend replacement points

`learners.js` contains per-learner snapshot/capture/load operations. Replace these with authenticated API access. `app.js` currently loads state, saves local changes and handles assessment/controller actions. Replace submission, account, content and feedback operations with API requests and server error/loading handling. `rewards.js` currently calculates preview rewards; production UI should display server-issued XP, eligible quests and badges rather than awarding them itself. `views.js` renders the returned values.

The model probability shown in the illustrative scenario is not a prediction. The production service must use the approved dataset and measured model comparison. Keep an explicitly identified score-rule baseline/fallback and report service unavailability without inventing confidence values.

The local UI separates learner records but permits role preview; this is intentional for frontend demonstration and must not be treated as authorization. No real password database, reset email, API credentials or institution account integration is included.

## Suggested records

Users, Levels, Modules, Lessons, LessonContent, LanguageConcepts, Phrases, PhraseCategories, Assessments, Questions, Options, Attempts, Responses, LessonProgress, UserConceptMastery, PlacementAssignments, Recommendations, GamificationEvents, BadgeDefinitions, UserBadges, DailyQuestClaims, Streaks, Feedback and PolicySettings.

Use transactional submission and unique constraints for an attempt submission key, learner/reward event key, learner/badge ID and learner/quest/calendar date. Store immutable response evidence and the policy/model versions used. The current topic question bank reuse should be replaced by explicit assessment-to-question ownership in the backend.

## Delivery limits

Verified frontend interactions do not certify multi-user security, browser compatibility across all devices, WCAG compliance, load targets, PWA/offline synchronization, language accuracy or ML performance. Add institution-reviewed language/audio assets and run those acceptance checks after backend integration.
