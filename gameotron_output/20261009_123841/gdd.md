# Game Design Document — "The Everything Button"

- **Run:** 20261009_123841
- **Jam theme:** "Anything Goes" (Gameotron Game Jam)
- **Selected concept:** #20 — The Everything Button (weighted score 5.00, rank 1; HOOK 5 / TOUCH 5 / THEME 5)
- **Genre:** Incremental / arcade hybrid
- **Platform:** Browser — single-file `index.html`, vanilla JS + Canvas + WebAudio
- **Scope directive honored:** All roll outcomes resolve to **resources / enemies / upgrades** through the single tap-and-hold + drag-to-route loop. No nested mini-games.

---

## 1. Game Overview

| Field | Value |
|-------|-------|
| **Title** | The Everything Button |
| **Tagline** | "Push the button. Anything goes." |
| **Genre** | Incremental / arcade hybrid |
| **Theme interpretation** | The jam theme is not a skin — it is the mechanic. A giant machine labeled **ANYTHING GOES** dispenses unpredictable content (resources, enemies, upgrades), and the player is the factory hand routing whatever the universe throws out. The slot-machine-of-its-own-systems gag *is* the game. |
| **Core fantasy** | Operate an impossible machine where every pull is a surprise and the skill is in catching, sorting, and surviving the chaos. |
| **Target audience** | Incremental-game players (Tap Titans / idle fans) and novelty-seekers who enjoy meta-humor and roll-for-randomness roguelite loops. Broad age range, one-handed mobile play, short 2–5 minute sessions with long-tail replay. |
| **Session length** | 2–5 minutes per run (5 zones), endless mode after victory. |
| **Play orientation** | Portrait and landscape both supported; layout reflows. No scrolling. |

---

## 2. Core Loop and Level / Zone Design

### 2.1 Core Loop (the one verb-to-rule-them-all)

```
   ┌─────────────────────────────────────────────────────────────┐
   │  1. TAP & HOLD the giant ANYTHING GOES button (center).      │
   │     A charge meter fills. Longer hold = higher roll TIER.    │
   │  2. RELEASE. The machine "rolls" → an OUTCOME TOKEN pops out  │
   │     (Resource | Enemy | Upgrade). Outcome is random within    │
   │     the current zone's weighted pool, biased by hold tier.    │
   │  3. DRAG the token to the matching routing zone:             │
   │        • Resource  → VAULT  (right)                          │
   │        • Upgrade   → SOCKET (top)                            │
   │        • Enemy     → CANNON (left)                           │
   │  4. Correct routing = points / effect. Wrong routing = fizzle │
   │     (no damage at low zones; small stability cost later).     │
   │  5. Repeat. Every accepted outcome adds to the ZONE METER.    │
   │     Filling it advances to the next zone (Zone Bonus awarded).│
   └─────────────────────────────────────────────────────────────┘
```

**Why it stays one loop:** Routing is the only action after a roll. Resources bank score, upgrades auto-modify future rolls (never open a new mode), and enemies are destroyed by routing them into the cannon (one tap — a brief auto-solve animation, not a fight). Every outcome resolves inside the same gesture language: *hold → release → drag → drop*.

**Meta layer (incremental hook):** Upgrades persist for the run and permanently unlock as account-level "blueprints" stored in `localStorage`, granting small passive perks on future runs (e.g., +1 starting socket, faster charge). This gives idle/incremental players a reason to return without bloating scope.

### 2.2 Playfield Layout (single screen, no scroll)

```
 ┌───────────────────────────────────────────────────────────┐
 │  HUD: SCORE   COMBO xN   ZONE j/5   STABILITY ████████░░   │
 │                                                            │
 │                    [ SOCKET (Upgrades) ]                   │
 │                          ▲                                 │
 │                          │   token arcs from machine       │
 │  [ CANNON ] ◀───────┌──────────────┐───────▶ [ VAULT ]     │
 │   (Enemies)         │              │        (Resources)    │
 │                     │   ◉  ANYGO   │                     │
 │                     │              │   ROUTING LANES     │
 │                     └──────────────┘   (radial)           │
 │                       [CHARGE METER RING]                  │
 │                                                            │
 │  Token lifetime bar under any active token                 │
 └───────────────────────────────────────────────────────────┘
```

- **Central button:** circular, ~30% of the shorter viewport edge. The charge ring wraps its rim.
- **Routing zones:** three radial drop targets — VAULT (right), CANNON (left), SOCKET (top). Finger-sized (≥ 88 px / ~23 mm) hit areas. A ghost outline highlights the matching zone once a token is picked up (beginner assist; fades out by Zone 3).
- **Everything is screen-space and reflowable**; on landscape, zones spread wider and the button shrinks proportionally. Canvas scales to `window.innerWidth/Height` with devicePixelRatio handling.

### 2.3 Zones (levels) with Linear Difficulty

Five zones, each requiring **N accepted outcomes** to fill the Zone Meter. Difficulty rises **linearly**.

| Zone | Name | Meter target (accepted rolls) | Token lifetime | Charge tiers available | Outcome pool | Notes |
|------|------|-------------------------------|----------------|------------------------|--------------|-------|
| 1 | The Warm-Up | 8 | **3.0 s** (very generous) | Tier 1 only | 70% Resource, 20% Upgrade, 10% Enemy | Learning phase. Only Resource + Enemy targets active; SOCKET arrives at 4 accepted rolls as a gentle teach. One token at a time. |
| 2 | Getting Weird | 10 | 2.6 s | Tier 1–2 | 55% Resource, 25% Upgrade, 20% Enemy | Combo scoring turns on. Tokens may spawn as "chained" (second token appears while first is mid-drag after 5 rolls). |
| 3 | Anything Goes | 12 | 2.3 s | Tier 1–2 | 45% Resource, 25% Upgrade, 30% Enemy | "Junk" outcomes appear: tokens that must be **discarded off-screen** (drag off edge) to clear. Adds decision pressure. |
| 4 | Overclocked | 14 | 2.0 s | Tier 1–3 | 40% Resource, 25% Upgrade, 35% Enemy | Wave rolls: releasing at Tier 3 can spawn **two enemy tokens** at once. |
| 5 | The Everything | 16 | 1.8 s | Tier 1–3 | 35% Resource, 30% Upgrade, 35% Enemy | Jackpot rolls unlock: perfect-tier hold + correct routing = bonus burst. Victory at meter completion. |

**Linear ramp justification:** Token lifetime decreases by a constant 0.3 s per zone (3.0 → 1.8), meter targets rise by +2 per zone, and enemy share rises ~+8% per zone. No exponential multipliers. Charge tier 3 is not available until Zone 4, so early players are never asked to hold long AND route fast simultaneously.

**Enemy/object placement rule:** Enemies are not placed on a map — they are *dispensed* as tokens by the machine and must be routed to the cannon. This keeps placement deterministic and readable: **objects appear at the machine mouth and travel nowhere until the player drags them.** Difficulty is expressed through token lifetime, spawn rate, and pool composition — not spatial complexity.

---

## 3. Controls (Touch + Mouse — both required, no keyboard)

### 3.1 Unified Input Model

Both input families feed one internal pointer abstraction: `pointerDown(x,y)`, `pointerMove(x,y)`, `pointerUp(x,y)`. This guarantees identical behavior across devices.

| Phase | Touch | Mouse |
|-------|-------|-------|
| Press | `touchstart` | `mousedown` |
| Drag | `touchmove` | `mousemove` |
| Release | `touchend` | `mouseup` |
| Cancel | `touchcancel` (treat as release, route at last point) | `mouseleave` while pressed |

All handlers call `e.preventDefault()` on the canvas to suppress scroll/zoom/pull-to-refresh; `touch-action: none` and `user-select: none` are set in CSS.

### 3.2 Input Zones

1. **Button core** (center circle) — press begins a charge. A press anywhere *outside* the button and outside an active token is ignored (prevents accidental rolls).
2. **Active token grab region** — an expanded circular hitbox (~64 px radius) around the current token; pressing within it grabs the token for routing.
3. **Routing drop zones** — VAULT / CANNON / SOCKET. On release, if the pointer is inside a zone's bounds → route there. If no zone is hit → token snaps back and continues its lifetime countdown.
4. **Pause button** — persistent top-right corner target (≥ 48 px), also reachable in-game.

### 3.3 Gestures

- **Tap-and-hold (charge):** press and keep holding the button; the charge ring fills. Release to roll. Hold longer than the tier cap simply caps at max tier (no overheat punishment in Zones 1–3; an optional soft "sweet-spot" band in Zones 4–5 rewards precise release).
- **Drag-to-route (single continuous gesture):** after release, press the token and drag it. Because roll = release and routing = a new drag, the flow is *hold → release → immediately press token → drag → release*. The game auto-targets the token if the player keeps their finger down and moves toward it (assist for small screens).
- **Flick-to-discard (Zone 3+):** drag a Junk token past the screen edge and release to delete it cleanly.
- **No keyboard is used.** (Keyboard is deliberately out of scope per AGENTS.md "optional" rule unless requested.)

### 3.4 Responsiveness Targets

- Input latency budget: **≤ 1 frame (16 ms)** from `touchstart`/`mousedown` to visible charge-ring growth.
- Minimum interactive target: **44 CSS px** (88 px design units), comfortably finger-sized.
- Immediate visual + audio acknowledgement on every press, even if the gesture is ultimately invalid.

---

## 4. Mechanics

### 4.1 Primary Mechanic — Roll-and-Route

Tap-and-hold the ANYTHING GOES button to charge; release to roll a weighted random outcome token; drag the token to the correct routing zone. This is the entire active verb of the game.

### 4.2 Secondary Mechanics

1. **Charge Tiering:** Hold duration maps to tier (T1: 0–1.0 s, T2: 1.0–2.0 s, T3: 2.0–3.0 s). Higher tiers shift the outcome pool toward rarer/better results and unlock special rolls (jackpot, double-enemy waves) in later zones.
2. **Combo System:** Consecutive correct routings build a combo multiplier (`x1 → x2 → x3 … capped x8`). A wrong routing or an expired token resets the combo to `x1`.
3. **Upgrade Sockets:** Correctly routing an Upgrade installs a module that modifies future rolls. Module examples (all resolve within the core loop):
   - **Magneto Vault** — Resources auto-drift toward VAULT if released near it (larger assist radius).
   - **Slow-Mo Crank** — Token lifetime +0.4 s.
   - **Twin Roller** — Chance to dispense a second resource token.
   - **Hot Cannon** — Enemy defeats award +10 extra points.
   - **Blueprints** — Increase the near-miss window (see §4.4).
4. **Stability (health):** The machine's Stability bar starts at 100. An enemy token that expires before reaching the cannon costs 12 Stability. Wrong routing costs 4 in Zones 3+ (0 in Zones 1–2 to stay beginner-friendly). Stability reaches 0 → Game Over.
5. **Junk Tokens (Zone 3+):** Value-less tokens that must be flicked off-screen. Correctly discarding them grants combo preservation but no points — a "decide-and-clear" pressure layer.

### 4.3 Win / Lose / Scoring

**Win:** Fill the Zone Meter in Zone 5 to complete the run → **Victory Screen**. Endless mode unlocks afterward (zones continue with capped linear ramp).

**Lose:** Stability reaches 0 → **Game Over Screen**. Best score and highest zone are saved.

**Scoring table:**

| Action | Points |
|--------|--------|
| Resource routed to VAULT | 10 × combo |
| Upgrade installed in SOCKET | 30 × combo |
| Enemy routed to CANNON (defeated) | 25 × combo (+10 with Hot Cannon) |
| Junk discarded off-screen | 0 (preserves combo) |
| **Near-Miss Bonus** | **+50 (flat)** |
| **Zone Bonus** (entering each new zone) | **+100 × zone number** |
| Jackpot roll (perfect T3 hold + correct route, Zone 5) | +200 |
| Combo chain completion (combo reaches x8) | +150 |

### 4.4 Difficulty Balance — Beginner-Friendly & Motivating (REQUIRED)

**Extra-easy entry barrier:**
- Zone 1 uses a **3.0 s** token lifetime (roughly 2× the reaction pressure of later zones).
- Only one token on screen at a time in Zone 1; no chained rolls.
- Wrong routing is **free** (no Stability cost) in Zones 1–2.
- **Assist outlines** highlight the matching routing zone as soon as a token is picked up, fading out by Zone 3.
- The SOCKET target is introduced at roll 4 of Zone 1 with an on-screen "NEW: drag upgrades here" callout, so players learn one zone at a time.

**Controls at the start:** direct and responsive. Pressing the big center button immediately fills the charge ring with visible + audible feedback (no dead zones, no double-tap ambiguity). The token is pre-highlighted as grabbable the instant it spawns.

**MOtivation — first success within 30 seconds:**
- Roll 1 of Zone 1 is **scripted as a guaranteed Resource** (70% pool biased to a sure resource on the very first roll) so the player routes it to VAULT for points in under ~10 seconds.
- Success chime, confetti burst, and a rising score counter fire on the first correct route.
- By ~20–30 seconds the player has completed 2–3 rolls, seen combo build, and reached the first **Zone Bonus**.

**Near-Miss Bonus (+50 pts):** awarded for risky maneuvers:
- Routing any token to its correct zone within the **final 0.4 s** of its lifetime (the window widens with the Blueprints upgrade), or
- Routing an **Enemy to the CANNON inside a small margin** of it expiring, or
- Flick-discarding Junk with the pointer already at the screen edge in the final 0.3 s.
A "NEAR MISS +50" popup and a distinct klaxon jingle celebrate it.

**Zone Bonus:** entering each new zone grants **+100 × zone number**, with a full-screen zone-transition banner, palette shift, and fanfare — a clear sense of progression.

**PROGRESSION — linear, not exponential:**
- Token lifetime: 3.0 → 2.6 → 2.3 → 2.0 → 1.8 s (constant steps).
- Meter target: 8 → 10 → 12 → 14 → 16 (constant +2).
- Enemy share: 10% → 20% → 30% → 35% → 35% (linear, then soft cap).
- Charge tiers unlock on a fixed schedule (T3 only from Zone 4) so complexity is layered *after* comfort.

**Learning phase then challenge:** Zones 1–2 are the learning phase (generous gaps between rolls, moderate token speed, one new concept at a time). Zones 3–5 are the challenge phase (chained tokens, Junk discards, double-enemy waves, precise-release sweet spots) — tension rises without ever spiking.

---

## 5. Visual Style

- **Palette:** carnival-bright and saturated. Buttons and gear housings in warm reds/ambers (#FF4757, #FFA502); resource tokens gold/green (#FFD32A, #2ED573); enemies hot magenta/violet (#FF3E80, #7B2FF7); upgrades cyan (#18D8F0); background deep navy (#0E1024) so tokens pop. Zone tints shift hue each zone (blue → teal → green → amber → fiery red) to signal escalation.
- **Shape language:** chunky, rounded, toy-machine aesthetic. The central button is a glossy dome with a chrome ring; gears visibly crank during charge.
- **Animation:** idle button bob; charge ring fills with a spinning gear; token spawn is a springy pop with squash-and-stretch; correct routing = token snaps in with a ring-burst; wrong routing = token shakes and greys out; jackpot = confetti burst + full-screen flash + screen-shake.
- **Typography:** bold condensed sans for HUD (score/zone), hand-drawn ransom-note accents on banners ("ANYTHING GOES", "ZONE 3!", "JACKPOT!") to sell the jam's chaotic energy.
- **Feedback clarity:** every token has a glowy color-coded outline and a small icon so its type is legible at a glance; the matching routing zone pulses in the token's color when grabbed.
- **Accessibility:** color-blind-safe icon shapes in addition to color, optional reduced-flash mode in Settings, high-contrast outlines, no reliance on text alone.
- **Canvas rendering:** all vector/procedural drawing (no external image assets) so the single `index.html` stays self-contained. Particle pools capped for mobile performance.

---

## 6. Audio Direction

- **Engine:** WebAudio API, fully procedural, synthesized at runtime — no external audio files. A master gain → music bus + SFX bus, each with an on/off toggle persisted in `localStorage`.
- **Music:** a looping upbeat carnival-electro bed built from scheduled oscillators. Each zone adds one layer/tempo notch (linear intensity), and the main button's low-pitched "machine hum" is tied to the charge state. Jackpots briefly duck the music and layer a triumphant jingle.
- **SFX palette:**
  - Button press: soft mechanical *thunk* + rising charge whir (pitch tracks hold duration).
  - Release/roll: slot-machine clatter and gear-ratchet ticks.
  - Resource collect: bright coin chime, ascending pitch with combo.
  - Upgrade install: satisfying socket *clack* + sci-fi shimmer.
  - Enemy defeat: cartoon splat/pop.
  - Near-Miss: distinct klaxon jingle layered over applause.
  - Zone transition fanfare: rising arpeggio, one semitone higher per zone.
  - Wrong routing: gentle "sad trombone" blip (never harsh).
  - Stability loss: low warning thrum; below 30 → heartbeat pulse.
- **Mix rules:** SFX ducking under zone fanfares; music and SFX buses independently mutable; all audio initialized on the first user gesture to satisfy browser autoplay policies.

---

## 7. Game States

```
        ┌──────────┐   Start    ┌────────────┐
        │  TITLE   │──────────▶│  GAMEPLAY  │◀──── Resume ────┐
        └────┬─────┘           └──┬───┬─────┘                 │
             │ How to Play        │   │                       │
             ▼                    │   │ Pause                 │
        ┌──────────┐              │   ▼                       │
        │HOW TO PLAY│◀────────────┘ ┌────────┐  back ──▶ TITLE │
        └──────────┘  (also from Pause) │ PAUSE │─────────────┘
                                        └───┬────┘
                                            │ Settings / How to Play overlay
              ┌────────────┐                │
              │  SETTINGS  │◀───────────────┘
              └────────────┘
   Gameplay end:
        Stability=0 ─▶ ┌────────────┐
                        │ GAME OVER  │──▶ Retry / Title
        Zone 5 clear ─▶ ┌────────────┐
                        │  VICTORY   │──▶ Endless / Title
```

State set: `TITLE`, `HOW_TO_PLAY`, `GAMEPLAY` (sub-states: `CHARGING`, `TOKEN_ACTIVE`, `ROUTING`, `TRANSITION`), `PAUSE`, `SETTINGS`, `GAME_OVER`, `VICTORY`.

- **Pause** can be entered from Gameplay at any time; it freezes the game clock, token timers, and audio music bed (SFX already playing are allowed to finish/cut cleanly).
- **No state transition loses progress** except starting a new run. Settings changes apply live and persist.
- **Pause on tab blur / visibilitychange** automatically (safety: prevents token expiry while the player is away).

---

## 8. User Interface and Screen Inventory (REQUIRED — 7 screens)

### Screen 1 — Title Screen
- Animated game logo "THE EVERYTHING BUTTON" with a glowing central button art, gears turning, confetti idle particles.
- Buttons: **START**, **HOW TO PLAY**, **SETTINGS**.
- Best score + highest zone displayed.
- Tapping the decorative central button plays a harmless "demo roll" sound (delightful micro-interaction).

### Screen 2 — Pause Menu (MUST HAVE)
Pauses gameplay and dims the playfield behind it. Contains all required controls:
- **Music ON/OFF toggle**
- **Sound FX ON/OFF toggle**
- **HOW TO PLAY** button (opens the instructions overlay)
- **GO BACK TO START MENU** button (with confirm to avoid accidental loss)
- **RESUME GAME** button
- (Secondary) **SETTINGS** button linking to Screen 5.

### Screen 3 — How to Play Screen
Beginner-friendly, illustrated, one concept per panel with a short caption:
1. **"TAP & HOLD the big button"** — charge the roll. Hold longer for better tier.
2. **"RELEASE to roll"** — the machine dispenses a token.
3. **"DRAG the token to the matching zone"** — Resource → VAULT, Upgrade → SOCKET, Enemy → CANNON.
4. **"Flick junk off the edge"** (Zone 3+).
5. **"Chain correct routes for combo points. Route near the buzzer for Near-Miss +50."**
6. **"Protect your Stability — don't let enemies expire."**
- Explicit input legend: **Touch: tap-hold-slide-release. Mouse: click-hold-drag-release.** Same gestures on phone or PC.
- A looping animated demo panel shows the whole gesture. **BACK** button returns to wherever it was opened from.

### Screen 4 — Gameplay Screen (HUD + playfield)
- **HUD top bar:** SCORE, COMBO xN, ZONE j/5, STABILITY bar.
- **Zone Meter** ring around the central button (progress to next zone).
- **Charge ring** on the button rim during hold.
- **Active token** with lifetime bar and type icon.
- **Routing zones** (VAULT / CANNON / SOCKET) with color-coded, pulsing highlights.
- **Pause button** top-right.
- **Toasts/banners:** "NEAR MISS +50", "ZONE 3!", "JACKPOT!", "COMBO x5".
- **Tutorial callouts** during Zone 1 (fade after first successful example).

### Screen 5 — Settings Screen
- **Music ON/OFF toggle**
- **Sound FX ON/OFF toggle**
- **Reduced-flash / high-contrast toggle** (accessibility)
- **RESET DATA** button (clears best score, blueprints, and all `localStorage` — with a confirm dialog)
- **CREDITS** section (design/code/audio/visual, plus jam attribution "Gameotron Game Jam — Theme: Anything Goes")
- **BACK** button.

### Screen 6 — Game Over Screen
- "STABILITY FAILURE" headline with a sad-trombone stinger and a cracked-machine illustration.
- Stats: final **SCORE**, **ZONE reached**, **BEST COMBO**, **TOKENS ROUTED**.
- Buttons: **RETRY**, **HOW TO PLAY**, **START MENU**.
- "New Best!" flair if applicable.

### Screen 7 — Victory Screen
- "YOU OPERATED THE EVERYTHING!" confetti-burst headline over the machine glowing.
- Stats: final **SCORE**, **TIME**, **BEST COMBO**, **JACKPOTS HIT**, **ENEMIES DEFEATED**.
- Buttons: **PLAY ENDLESS MODE**, **RETRY**, **START MENU**.
- Unlocked blueprint(s) shown ("New blueprint installed to your machine!").

> Full state coverage: Title (1), Pause (2), How to Play (3), Gameplay (4), Settings (5), Game Over (6), Victory (7) — **7 screens**, exceeding the 6-screen requirement, with the Pause Menu containing music toggle, SFX toggle, How to Play, back-to-start, and resume.

---

## 9. Monetization / Scope

**FREE-TO-PLAY WITH NO MONETIZATION.**

- No ads, no in-app purchases, no paywalls, no energy timers, no cosmetic store, no login, no account.
- All content is available from the first launch.
- Optional *self-imposed* engagement hooks (best score, blueprints) live entirely client-side in `localStorage`.
- Single-file `index.html` deployable to itch.io as an HTML5 game.

---

## 10. Implementation Notes

### 10.1 Tech Stack & Constraints
- **One file:** `index.html` — all HTML, CSS, and JS embedded. Vanilla JS only; no libraries, no build step, no npm.
- **Rendering:** single `<canvas>` sized to the viewport with `devicePixelRatio` scaling; CSS handles overlay DOM for menus (screens 1–3, 5–7) so text/layout is crisp and easy to maintain. Canvas handles the gameplay playfield and particles.
- **Responsive:** `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">`; `resize`/`orientationchange` recompute layout anchors from viewport dimensions; portrait and landscape both supported.
- **Touch/mouse:** unified pointer abstraction fed by `touchstart/touchmove/touchend/touchcancel` and `mousedown/mousemove/mouseup`; `touch-action:none`; `preventDefault` on game gestures.

### 10.2 Core Systems / Data Structures
- **Game state object:** `{ state, zone, score, combo, stability, zoneMeter, settings, modules[], tokens[], particles[] }`.
- **Token:** `{ type, x, y, vx, vy, bornAt, lifetime, radius, grabbable }`.
- **Routing zones:** array of `{ id:'vault'|'cannon'|'socket', cx, cy, r }` recomputed on resize.
- **RNG/weights:** per-zone outcome weight table; charge tier applies a multiplier to rare-result weights. Scripted first roll forces a Resource.
- **Update loop:** `requestAnimationFrame` with a fixed logical timestep accumulator for deterministic timers; `visibilitychange` triggers auto-pause.
- **Particles:** pooled objects with a hard cap (e.g., 300) for mobile performance; juice features gated by a `juiceEnabled` flag and the reduced-flash setting.

### 10.3 Audio (WebAudio)
- Single `AudioContext` created/resumed on first user gesture. Node graph: `source(s) → busGain(music|sfx) → masterGain → destination`.
- Music = scheduled oscillator sequence advanced per zone (linear layer add). SFX = short synthesized envelopes (osc + noise + filter) defined per event.
- Toggles flip the corresponding `busGain` `gain.value` and persist to `localStorage`.

### 10.4 Persistence (`localStorage` keys)
- `teb_bestScore`, `teb_bestZone`, `teb_blueprints`, `teb_settings { music, sfx, reducedFlash }`.
- `RESET DATA` clears all `teb_*` keys after confirmation.

### 10.5 Performance & Robustness
- Target 60 fps on mid-range mobile; degrade particles first if frame time > 20 ms.
- All timers derived from `performance.now()`, never accumulated drift-prone counters.
- Defensive guards: no `null` token dereference during routing; `touchend` without prior `touchstart` ignored; multiple simultaneous touches use only the first tracked pointer for the core gesture.

### 10.6 Deploy
- Output `index.html` to `build/`; upload to itch.io via Butler (`username/project:html5`). No server required.

---

## 11. Requirement Traceability

| Requirement | Section |
|-------------|---------|
| Core loop + zones + increasing (linear) difficulty + placement | §2 |
| Touch + mouse, input zones, gestures, no keyboard | §3 |
| Primary/secondary mechanics, win/lose, scoring | §4.1–4.3 |
| Beginner-friendly balance, first success <30 s, Near-Miss +50, Zone Bonus, linear, learn→challenge | §4.4 |
| Visual style | §5 |
| Audio direction (WebAudio) | §6 |
| Game states | §7 |
| 6+ screens incl. Pause with music/SFX/HowTo/back/resume | §8 (7 screens) |
| Free-to-play, no monetization | §9 |
| Vanilla JS, single index.html, WebAudio, canvas, responsive | §10 |
| Title, genre, theme interpretation, target audience | §1 |
| No nested mini-games; outcomes = resources/enemies/upgrades | §2, §4 |

— End of Game Design Document —
