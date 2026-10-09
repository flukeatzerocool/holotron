# GAME DESIGN DOCUMENT — Rule Breaker Dungeon

**Run:** 20261009_151802 · **Theme:** "Anything Goes" · **Concept:** #7 (human-approved winner, rank 2, weighted 4.75)
**Genre:** Grid puzzle-dungeon crawler (tap-to-move, rule-inversion)
**World model:** `world://map` for Novel `rule-breaker-dungeon-151802` (validated by `world_agent`)
**Deliverable:** single `index.html`, vanilla JS, embedded HTML/CSS/JS, no external assets

---

## 10. Game Overview

| Field | Value |
|-------|-------|
| **Title** | **Rule Breaker Dungeon** |
| **Genre** | Grid puzzle-dungeon crawler / rule-inversion puzzle |
| **Core verb** | Break the rule — the displayed law is the puzzle, and obeying it is the trap |
| **Theme interpretation** | The theme is *structural*, not skinned. A dungeon whose rulebook has been torn apart; every room posts a rule and the only way forward is to violate it. "Anything Goes" = no rule is sacred, and rebellion is rewarded. |
| **USP** | The win condition is usually the *opposite* of the instruction on screen. The player must read a rule, distrust it, and shatter it. |
| **Target audience** | Puzzle veterans and meta-game fans; secondary: curious casual players who enjoy "aha" inversions. Ages 10+, phone-first. |
| **Session length** | 3–6 minutes (6 rooms + victory), replayable for score/time |
| **Platform** | Mobile web + desktop browser, single HTML file, canvas, WebAudio |

**Logline:** *Enter a dungeon where every wall is chalked with a rule. Break all six, ring the bell, and tear the final page from the master rulebook.*

---

## 1. Core Loop and Level (Room) Design

### 1.1 The fundamental loop
For every room:

1. **ENTER** — the room fades in with a glitch-static wipe; `window.WORLD.current` is updated to the room slug.
2. **READ** — a large, stark **RULE banner** posts the room's law at the top of the screen.
3. **DISTRUST** — the player taps an adjacent tile to move. Compliant moves are safe but will *never* open the way; the puzzle is finding the **forbidden action**.
4. **BREAK** — performing the forbidden action shatters the rule (*glass-crack SFX*, screen-shake, particle burst of "rule shards").
5. **OPEN** — the shatter unlocks the room's doors. Doors map 1:1 to the `exits` in `window.WORLD.rooms[slug].exits`; tapping a door traverses to its declared target.
6. **COLLECT** — tags/objects (`rebel-graffiti`, `cracked-rulebook`, `alarm-bell`, `master-rulebook`) are visible interactables that grant lore + score.

A room is **cleared** when its rule is broken. The dungeon is **won** when the player breaks the final rule in Rule Core and tears out the master rulebook's last page.

### 1.2 Dungeon layout — exactly the 6 validated rooms

The game consumes `world_map.json` verbatim. Layout/topology (must not be altered):

```
                         [rule-core]  (GOAL — tear out final page)
                              | east
                              v
[entry-hall] --north--> [chalk-corridor] --north--> [bell-chamber]
 (START)                  (HUB)  ^                       | east
                             |   | west                v
                             |   +---- [gravity-well] --south--> [torn-library]
                             +----------east-------------------'
Loop: chalk-corridor → bell-chamber → torn-library → gravity-well → chalk-corridor
```

| # | Room slug | Display name | Exits (verbatim) | Things | Rule to break |
|---|-----------|--------------|------------------|--------|---------------|
| 1 | `entry-hall` | Entry Hall | north → chalk-corridor | — | "Walk only on stone." (Step on the chalk tile.) |
| 2 | `chalk-corridor` | Chalk Corridor | south→entry-hall, east→gravity-well, north→bell-chamber, west→rule-core | `rebel-graffiti` | "NEVER GO LEFT." (Move west.) |
| 3 | `gravity-well` | Gravity Well | west→chalk-corridor, south→torn-library | — | "GRAVITY POINTS DOWN." (Flip gravity up.) |
| 4 | `torn-library` | Torn Library | north→gravity-well, west→bell-chamber | `cracked-rulebook` | "WALLS ARE SOLID." (Eat a wall.) |
| 5 | `bell-chamber` | Bell Chamber | east→torn-library, south→chalk-corridor | `alarm-bell` | "DO NOT RING THE BELL." (Ring it.) |
| 6 | `rule-core` | Rule Core | east→chalk-corridor | `master-rulebook` | "THE MASTER RULEBOOK IS ABSOLUTE." (Tear out the page.) |

### 1.3 Per-room design (escalating difficulty, linear)

**Room 1 — Entry Hall (tutorial, ~5–15 s)**
- 5×5 stone grid. Player token in the center. One tile of chalk is painted on the floor, clearly the "wrong" color/texture.
- RULE banner: *"Walk only on stone."*
- Compliant moves are unlimited and safe; tapping the chalk tile is the break. **No hazards, no timer, no way to fail.** This guarantees the first success experience well inside 30 seconds.
- On shatter: north door lights up; `rebel-graffiti` from the corridor is previewed as a hook ("ANYTHING GOES. Rules are just suggestions with good PR.").
- Teaches: tap-to-move, "the rule is lying," doors open on rule-break.

**Room 2 — Chalk Corridor (hub, ~15–30 s)**
- 7×5 corridor grid. Walls chalked floor-to-ceiling with crossed-out rules; `rebel-graffiti` on the west wall.
- RULE banner: *"NEVER GO LEFT."*
- The **west door leads to Rule Core** (the goal), but it is exactly the forbidden direction — and it is *not* where the player should go first (they still need the loop rooms to build score/power). The other three doors (south, east, north) are unlocked on shatter.
- Break action: perform any westward move. A floating "SHATTERED!" toast fires, graffiti becomes readable (lore: *"ANYTHING GOES. Rules are just suggestions with good PR."*).
- Teaches: forbidden action = progression; the room with the most exits is the hub.

**Room 3 — Gravity Well (~25–45 s)**
- 7×7 round shaft. The floor is marked as a "suggestion." Loose pebbles drift.
- RULE banner: *"GRAVITY POINTS DOWN."*
- Compliant: normal tap-moves. Break action: a contextual **FLIP button** (and swipe-up gesture) sends the player and pebbles upward; the player must land on the **ceiling goal tile**.
- First hazard introduced: **drifting pebble** (1), moves at 0.6 tiles/s; contact bumps the player down one tile (no death — soft fail). Screen tilts 8° when gravity flips.
- Teaches: a mechanic toggle; hazards exist but are gentle.

**Room 4 — Torn Library (~35–60 s)**
- 7×7. Shelves of shredded rulebooks; a windless draft swirls pages. `cracked-rulebook` is visible *behind a wall*.
- RULE banner: *"WALLS ARE SOLID."*
- Break action: **eat a wall** — tap an adjacent wall tile; a bite-chew animation removes it, revealing the page/thing behind.
- Hazards: **2 wind gusts** push the player 0.3 tiles between moves (visualized as drifting pages). The target wall is guarded by one gust, creating a timed approach.
- Teaches: walls are resources; positional timing under a push force.

**Room 5 — Bell Chamber (~35–60 s, tension peak)**
- 7×7. A brass bell the size of a door hangs center. `alarm-bell` readable.
- RULE banner: *"DO NOT RING THE BELL."*
- Break action: **ring the bell** — move onto its base tile. Every rule the player has broken already rings it a little louder.
- Introducing a **soft timer**: once the player enters, an **Alarm Meter** fills from 0→100 in **60 s at base**, reduced by **−8 s for each rule already shattered** (min 30 s). If it fills, the room "ejects" the player to Chalk Corridor (soft fail, no game over) and the meter resets — retry is cheap.
- Escalating alarm pulse audio as the meter fills. This is the difficulty apex before the finale.
- Teaches: time pressure and urgency, still with a forgiving fail state.

**Room 6 — Rule Core (finale, ~20–40 s)**
- 7×7 pulsing heart of the dungeon. The `master-rulebook` is chained open at center.
- RULE banner: *"THE MASTER RULEBOOK IS ABSOLUTE. DO NOT TAP."* — an explicit anti-instruction.
- Break action: **tap/tear the master rulebook's final page**. A dramatic multi-stage shatter: the rule text glitches, the page rips out, the whole screen cracks, and the dungeon's rules collapse into confetti.
- If the player obeys and taps the east exit instead, a wry taunt ("Rules are just suggestions with good PR…") and they may retry without penalty. The inversion is the win.

**Difficulty progression rationale (LINEAR):** hazard count goes 0 → 0 → 1 → 2+push → timer → inversion. Each room adds exactly one new complication on top of the last. No room combines two brand-new systems. Gaps stay generous in rooms 1–2 (learning phase) and tighten through rooms 4–5 (challenge phase).

---

## 2. Controls

**Both touch and mouse are mandatory. No keyboard is required.**

### 2.1 Touch (smartphone / tablet)
| Gesture | Event | Action |
|---------|-------|--------|
| Tap a tile | `touchstart` → `touchend` within 300 ms / <12 px | Move one tile toward the tapped tile (if adjacent), or perform the room's context action |
| Swipe up | `touchstart` → `touchmove` (≥40 px up) → `touchend` | Gravity-flip (active in Gravity Well) |
| Swipe left/right | `touchstart` → `touchmove` → `touchend` | Pan the board (when board larger than viewport); never accidental movement |
| Hold on banner | `touchstart` held ≥500 ms | Expand the RULE banner into a detail card (rule text + hint after 3 failed attempts) |
| Tap the on-screen D-pad zone | `touchstart` on zone | Discrete directional move (accessibility fallback, bottom-left) |
| Tap the FLIP button | `touchstart` on zone | Gravity flip (contextual, bottom-right) |

All touch handlers call `preventDefault()` on the canvas to suppress scroll/zoom during play.

### 2.2 Mouse (PC browser)
- **Move:** `mousedown` on a tile → `mouseup` on the same tile (click) = move.
- **Swipe:** `mousedown` → `mousemove` (≥40 px) → `mouseup` = swipe gesture (same as touch).
- **Hover:** `mousemove` highlights valid target tiles (desktop affordance; ignored on touch devices).
- **Drag:** `mousedown` + `mousemove` pans the board when it overflows.

### 2.3 Input zones (layout)
```
┌──────────────────────────────────────────┐
│  [ RULE BANNER ]        (tap/hold)        │  top 12%
├──────────────────────────────────────────┤
│                                            │
│           BOARD / TILE GRID                │  middle 76%
│      (tap tile · swipe to pan)             │
│                                            │
├──────────────────────────────────────────┤
│ [D-PAD]                    [FLIP (ctx)]    │  bottom 12%
└──────────────────────────────────────────┘
```
Touch targets are ≥ 48 px. The FLIP button only renders in Gravity Well. A persistent PAUSE button sits top-right.

### 2.4 World contract (REQUIRED — implement exactly)
The game embeds `world_map.json` **verbatim** as `window.WORLD` and uses it as the single source of truth for all level/room generation:

```js
// Embedded verbatim from world_map.json:
window.WORLD = {
  "seed": 0,
  "start": "entry-hall",
  "rooms": { /* entry-hall, chalk-corridor, gravity-well,
                torn-library, bell-chamber, rule-core */ }
};

// Set on load and on EVERY room change:
//   window.WORLD.current  === current room slug (e.g. "chalk-corridor")
//   window.WORLD.visited  === array of slugs visited this run (added, additive)

// Traversal API — MUST invoke the SAME transition handler the UI uses:
window.move(dir)  // dir ∈ "north" | "south" | "east" | "west"
                  // - if dir is a declared exit of window.WORLD.current:
                  //     performs the transition, sets window.WORLD.current,
                  //     renders the new room, returns the target slug
                  // - otherwise: fires the "wall"/blocked feedback and returns false
```

**Rules of the contract:**
- Room generation reads only `window.WORLD.rooms[slug]` — no hard-coded second copy of the map.
- Every door the player can tap corresponds to a key in that room's `exits`; no door exists that is absent from `window.WORLD`.
- `window.move(dir)` is the exact function the door-tap UI calls; the API and the UI can never diverge.
- `window.WORLD.current` is updated synchronously inside that handler, so automated traversal tests can drive `window.move("north")` etc. and assert `window.WORLD.current`.
- The start room is always `window.WORLD.start` (`"entry-hall"`).

---

## 3. Mechanics

### 3.1 Primary and secondary mechanics
- **Primary — Tap-to-move + rule inversion.** Move on a tile grid by tapping adjacent tiles; the room's posted rule defines an illegal/forbidden action, and performing it is the break that unlocks the exits.
- **Secondary — Environmental exploitation.** Gravity flip (Gravity Well), wall eating (Torn Library), push-dodging (Torn Library wind), and timed alarm management (Bell Chamber) layer one escalating complication per room.
- **Collectible/lore layer.** `rebel-graffiti`, `cracked-rulebook`, `alarm-bell`, `master-rulebook` are interactable things granting score and flavor from `world_map.txt`.

### 3.2 Win / lose conditions
- **Win:** reach `rule-core` and tear out the `master-rulebook`'s final page. → **Victory screen** with final score, time, rules broken (must be 6), things collected (4/4).
- **Soft lose / fail-forward:** hazards bump rather than kill; the Bell Chamber timer ejects to Chalk Corridor. The player **never hard-loses progress**.
- **Game Over:** there is no death state. A run ends only in Victory, or the player quits to the Title. (The Game Over screen is retained per spec for an optional "Alarm Overwhelmed" arcade variant and for score submission on quit — see §6/§7.)

### 3.3 Scoring system
| Event | Points |
|-------|--------|
| Tile move | +1 |
| **Room-entry / Zone Bonus** (first time entering a new room) | **+50** |
| **Rule Shatter Bonus** (break a room's rule) | +100 (×room index: ×1…×6 for escalation flair) |
| Thing collected (`rebel-graffiti`, `cracked-rulebook`, `alarm-bell`, `master-rulebook`) | +25 each |
| **Near-Miss Bonus** (passing within 0.75 tile of a hazard: pebble, wind edge, alarm base) | **+50** (3 s cooldown) |
| No-hit run in a hazard room | +75 |
| Bell Chamber clears under 50% alarm | +150 |
| **Final Page Bonus** (win) | +500 |
| Time bonus | `max(0, 900 − seconds×5)` |

Persistent best score in `localStorage` (`rbd_best`).

### 3.4 DIFFICULTY BALANCE — beginner-friendly & motivating (REQUIRED)

**Extra-easy entry barrier (Room 1):**
- Zero hazards, zero timer, zero fail states. The single break action is a visibly distinct chalk tile. A gentle pulsing arrow points at it after 4 s of inactivity. **First success is achievable in ~5 seconds**, guaranteed inside 30 s.

**Controls at the start — direct and responsive:**
- One tap = one move, immediate canvas feedback (token snaps tile-to-tile with a 90 ms ease). No menu, no aim, no timing skill required in rooms 1–2. The D-pad fallback removes any ambiguity.

**First success within 30 seconds:**
- Entry Hall shatter → north door opens → the "ANYTHING GOES" graffiti reveal delivers the hook before the 30-second mark. Confirmed by the tutorial's pacing budget (5–15 s).

**Motivation systems:**
- **Near-Miss Bonus (+50)** rewards risky maneuvers: skimming a drifting pebble in Gravity Well, grazing a wind gust in Torn Library, or ringing the bell with the alarm at 90%.
- **Zone Bonus (+50)** on every new room entry gives a visible sense of progression and a reason to explore all six rooms rather than rush the goal.
- Escalating "HEADING DEEPER" zone toasts and a rules-broken HUD counter (0/6 → 6/6) provide constant forward feedback.

**Progression — LINEAR, not exponential:**
| Room | New complication | Hazards | Time pressure | Fail severity |
|------|------------------|---------|---------------|---------------|
| 1 Entry Hall | tap-to-move + rule-break (tutorial) | 0 | none | none |
| 2 Chalk Corridor | forbidden direction | 0 | none | none |
| 3 Gravity Well | gravity flip | 1 pebble @ 0.6 tiles/s | none | bump down 1 tile |
| 4 Torn Library | wall eating | 2 wind gusts @ 0.3 tile push | none | pushed 1 tile |
| 5 Bell Chamber | soft timer | alarm meter | 60 s (−8 s/prior break, min 30 s) | eject to hub, retry |
| 6 Rule Core | final inversion | 0 | none | none (obey = taunt, retry) |

- **Learning phase (rooms 1–2):** generous, hazard-free, no time limit — the concept is taught gently.
- **Challenge phase (rooms 4–5):** tighter gaps, more hazard types, first real timer — but still fail-forward.
- Each step adds *one* variable; difficulty rises linearly room-over-room, never doubling.

---

## 4. Visual Style

- **Palette:** stark dungeon stone (charcoal `#1b1b22`, slate `#2b2b36`) against rebellious accents — chalk white `#f2efe4`, blood-scrawl red `#e0453b`, and "shatter" cyan `#57e0d0`.
- **Tiles:** bold, high-contrast, hand-chalked outlines with wobbling line-boil. Rules are literally scrawled on floors/walls and crossed out by a bolder hand.
- **Player token:** a small defiant chalk-drawn figure (stick-figure with a raised marker), squash-and-stretch on each move.
- **Rule banner:** ragged ransom-note typography, a torn strip of rulebook pinned to the top of the screen; glitches when broken.
- **Rule-break VFX:** glass-crack shatter, letter-glyph shards, glitch-static wipe between rooms, 6 px screen-shake, brief chromatic-aberration flash.
- **Special rooms:** Gravity Well tilts the camera 8° on flip with drifting pebbles; Torn Library has swirling paper pages; Bell Chamber pulses red with the alarm; Rule Core has a throbbing heart-glow and cracks the whole screen at the finale.
- **Graffiti layer:** rebellious scrawls ("ANYTHING GOES", "RULES ARE LIES") splashed across walls as it learns them.
- **UI:** flat, legible, oversized for phones; everything readable at 375 px width.
- **Juice (for `juice_agent`):** particle shards on every shatter, hit-stop ~80 ms on the final page tear, screen tilt/roll, floating score popups, zone-entry banners.

---

## 5. Audio Direction

All sound synthesized with **WebAudio** (no external files). A single `AudioContext` unlocked on first tap.

- **Music:** a low, looping dungeon drone in a minor key; each room the player clears drops in one new layer (a pulse, a bass line, a shatter-bell motif) so the soundtrack itself "breaks rules" as rebellion grows. Toggleable.
- **Rule shatter:** bright glass-crack + descending glyph-noise burst (the signature SFX).
- **Move:** soft chalk-scratch tick.
- **Blocked move:** dull muted thud.
- **Gravity flip:** rising whoosh with a shimmering pitch bend; screen-tilt whoomp.
- **Wall eat:** crunchy bit-crunch chomp.
- **Bell ring:** metallic rising clang; alarm pulse accelerates as the Alarm Meter fills (escalating alarm pulses, required by concept).
- **Near-Miss:** short tight "shing" sting.
- **Zone entry:** warm two-note progression chime.
- **Final page tear:** sustained ripping-paper + deep boom + glass cascade, with hit-stop silence for impact.
- **Victory:** triumphant major-key rendition of the dungeon drone.
- **UI:** crisp click for buttons, soft toggle ticks in Pause/Settings.
- **Mix:** all SFX respect the SFX toggle; music separate; final-page tear ducks SFX bus briefly for drama.

---

## 6. Game States

Finite state machine, one active state at a time:

```
BOOT → TITLE → HOW_TO_PLAY ⇄ TITLE
TITLE → PLAYING
PLAYING ⇄ PAUSED → {RESUME→PLAYING, SETTINGS→SETTINGS, HOW_TO_PLAY→HOW_TO_PLAY, TITLE→TITLE}
PLAYING → GAME_OVER (arcade/alarm-overwhelmed variant or quit-with-score)
PLAYING → VICTORY (final page torn)
GAME_OVER → {RETRY→PLAYING, TITLE→TITLE}
VICTORY  → {PLAY_AGAIN→PLAYING, TITLE→TITLE}
SETTINGS → (back) → TITLE or PAUSED (return to previous)
HOW_TO_PLAY → (back) → previous state
```

- **BOOT:** asset-free init; builds `window.WORLD`, sets `window.WORLD.current = window.WORLD.start`.
- **TITLE / HOW_TO_PLAY / PAUSED / SETTINGS / GAMEPLAY / GAME_OVER / VICTORY** are the seven screens (§7).
- **PAUSED** freezes the simulation clock and mutes/ducks audio; the Alarm Meter pauses.
- Transitions use the glitch-static wipe (180 ms) except menus (120 ms fade).

---

## 7. User Interface and Screen Inventory (7 screens — all REQUIRED)

### a. Title Screen
- Game logo ("RULE BREAKER DUNGEON" in chalk-cracked lettering).
- **Start** button → `PLAYING`.
- **How to Play** button → `HOW_TO_PLAY`.
- Small best-score readout; subtle animated chalk graffiti background.

### b. How to Play Screen
Beginner-friendly, all controls explained for touch and mouse:
- **Goal:** "Every room posts a rule. The rule is a lie. Break it to open the doors."
- **Move:** "Tap the tile you want to step onto." (Touch: tap; Mouse: click.)
- **Doors:** "After you break the rule, tap a lit door to go to the next room."
- **Special actions:** "Tap the FLIP button (or swipe up) to flip gravity. Tap a wall to eat it. Tap the bell to ring it."
- **Scoring:** explains rule-shatter, zone, and near-miss bonuses.
- Explicit "The rule is always lying — that's the whole game" call-out.
- **Back** button.

### c. Pause Menu (MUST HAVE)
- **Resume Game** button → back to `PLAYING`.
- **Music On/Off** toggle.
- **Sound FX On/Off** toggle.
- **How to Play** button → instructions overlay.
- **Go Back to Start Menu** button → `TITLE`.

### d. Gameplay Screen
- Canvas board, RULE banner, HUD (score, rules broken 0/6, things 0/4, room name), Pause button top-right, contextual FLIP/D-pad zones at the bottom.

### e. Settings Screen
- **Music On/Off** toggle.
- **Sound FX On/Off** toggle.
- **Reset Data** button (clears `rbd_best` + progress; confirmation prompt).
- **Credits** button/section (team/agent pipeline credits).
- **Back** button.

### f. Game Over Screen
- Shown for the optional arcade "Alarm Overwhelmed" variant or on quit-with-score.
- Final score, rules broken, things collected, best score.
- **Retry** button, **Back to Title** button.

### g. Victory Screen
- "YOU TORE OUT THE FINAL PAGE." + shattered-rulebook confetti.
- Final score, total time, rules broken (6/6), things (4/4), best-score comparison.
- **Play Again** button, **Back to Title** button.

All buttons are ≥ 48 px touch targets with both `touchstart` and mouse `click` (via `pointer`/unified handler) support.

---

## 8. Monetization / Scope

**FREE-TO-PLAY WITH NO MONETIZATION.** No ads, no in-app purchases, no paywalls, no accounts, no analytics, no network calls. All content ships in the single `index.html`. Full experience unlocked from first load. Local best-score stored only in `localStorage`.

---

## 9. Implementation Notes

- **Single file:** one `index.html` containing all HTML, CSS, and JavaScript inline; vanilla JS only; no frameworks, no build step, no external assets.
- **Canvas:** one responsive `<canvas>` scaled via `devicePixelRatio`; `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`; letterboxed to the design aspect ratio; all layout math in virtual units with a single scale factor.
- **Rendering loop:** `requestAnimationFrame`; fixed-step logic accumulator for hazards, variable render. Canvas 2D only.
- **World embedding (CRITICAL):** paste the contents of `world_map.json` verbatim as `window.WORLD`. Never duplicate the map. Generate room grids and doors strictly from `window.WORLD.rooms[slug].exits` and `.things`. Set `window.WORLD.current` on load and every transition. Implement `window.move(dir)` as the single shared transition handler used by both UI input and automated tests.
- **Input:** unified pointer handling — register `touchstart/touchmove/touchend` (with `{passive:false}` and `preventDefault`) **and** `mousedown/mousemove/mouseup`; normalize to one gesture state machine. No keyboard dependence (optional WASD/arrows may be added but must remain optional).
- **Audio:** one lazily-created `AudioContext`, resumed on first user gesture; oscillators + noise buffers for all SFX; gain buses for `music` and `sfx` tied to the toggles.
- **State machine:** explicit `GameState` constant object driving screen switching; pause freezes the simulation clock and ducks audio.
- **Persistence:** `localStorage` keys `rbd_best`, `rbd_music`, `rbd_sfx`; guarded in try/catch.
- **Accessibility:** large targets, D-pad fallback, color-plus-icon rule cues (never color alone), high contrast.
- **Performance:** cap particles; pre-render static tile textures to offscreen canvases; target 60 fps on a mid-range phone (375×667) and 1920×1080 desktop.
- **Testing hooks:** `window.move(dir)` returns the target slug or `false`; `window.WORLD.current` always reflects the live room, enabling headless traversal assertions across all six rooms.

---

*End of Game Design Document.*
