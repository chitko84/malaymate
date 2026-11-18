# Portal adventure interaction design

The project owner's Blooket map reference informed the illustrated Malaysia route. Duolingo's official Adventures description informed the emphasis on moving through an environment, meaningful contextual actions and friendly feedback:

https://blog.duolingo.com/adventures/

These are interaction references. The artwork, character geometry, portal mechanics and code are original to this project; third-party game assets, logos and characters are not bundled.

## Implemented flow

1. Select a level on the existing Malaysia map.
2. Read the short introduction in solo mode. Multiplayer starts when the host begins the ready room.
3. Read the mission in a small in-world speech bubble.
4. Walk with WASD/arrows, use the touch movement pad, or click the path. Space or the jump button makes the explorer jump.
5. Walk into a word portal or click its sign/3D frame. Number keys 1–3 also enter a portal when the scene has keyboard focus. Native Enter/Space activation works on focused portal buttons.
6. The explorer reaches the portal, its curtain opens, and the answer is marked. Repeated inputs are locked during travel and marking.
7. Read helpful English/Malay feedback. Correct answers award 100 game points, with a visual burst and optional synthesized sound. Continue when ready.
8. Finish four portals. Three correct answers pass the solo level. Existing star, first-pass XP and unlock rules are preserved.

There is no separate question form or answer card panel below the world. The new mission bubble and portal signs are part of the game scene and remain accessible HTML over the Three.js view.

## Exploration and feedback

Each adventure has 12 trail coins. They are collected by moving close to them and are run collectibles only. They are separate from game points, placement, mastery, XP and leaderboard scores. Replay resets coins. Jumping is a playful movement action, not a scoring shortcut.

Sound is off by default. The toggle enables short locally generated oscillator tones for portal entry, coins and answers. No background music or external audio files are required. Reduced-motion preferences remove confetti and nonessential world animation.

Pause stops movement and travel. Help explains the controls. Desktop full-screen is available when supported by the browser. Portal signs support keyboard focus and visible focus rings. The phone layout has larger touch controls and a front-facing camera so signs stay separate and readable.

## Multiplayer and recovery

Both players use the same scene and see live server scores and portal counts. A companion avatar represents the other player's checkpoint; continuous player positions are not sent to the server. Each player's displayed portal remains stable while feedback is read, even when live polling advances the shared room data. Late polling responses cannot move a player's server progress backward.

The room API still validates and scores answers. Existing indexed submissions are idempotent. A failed answer request resets the explorer to the checkpoint so the learner can retry deliberately; it does not automatically retry in a loop. Requests time out with a readable message. Completed rounds and XP keep their existing identity rules. Core student identity and learning persistence retain the demonstration boundaries in README.

## Verification

TypeScript and automated regression tests check movement boundaries, diagonal speed, collision/arrival selection, checkpoints, mission text, scoring, replay XP, map unlocking and the room service. Browser QA covered a wrong answer, pause/resume, a full solo completion with 300 points/two stars/30 XP, a complete two-player room with 400 versus 300 points, live progress, mobile portal answering at 375 CSS pixels and absence of the removed question panel. The test browser uses the software 3D renderer; hardware WebGL and target-device performance need separate device testing.
