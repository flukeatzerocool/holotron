# GAME DESIGN DOCUMENT — TORRE NOSFERATU

**Concept:** #14 "Dread Weather" (human-gate pick; weighted co-leader 4.75, tied with #7/#16)
**Theme:** *Torre Nosferatu — escape a pitch-black candle-lit tower before Count Orlok takes your light*
**Run:** 20261010_095651 · **test_seed:** 20261010 · **Template:** `world_template.json` (floor-agnostic, v2)
**Build:** single `index.html`, vanilla JS, all HTML/CSS/JS embedded.
**Controls:** touch + mouse **mandatory**; WASD/arrows/Space **enabled this run** (full controls).
**Source of truth for systems:** `window.TEMPLATE` (embedded from `world_template.json`). Every system below is read from the template at runtime; nothing is hard-coded. Numbers in this document are the *design intent* the game realizes from template fields.

> This GDD is authored from `direction.txt` (the creative-direction brief) as a **constraint source**, not a spec. The brief's §15 must-haves are mapped explicitly in **§11 Brief must-haves acceptance checklist**. Where the brief leaves a value open ("exact numbers live in the GDD"), the decision and its number are stated inline and collected in **§12 Design decisions the brief left to the GDD**.

---

## 1. Game Overview

| Field | Value |
|---|---|
| **Title** | Torre Nosferatu |
| **Genre** | Turn-based, grid-based, gothic-horror roguelike **descent**. Touch-first. |
| **Theme interpretation** | The jam theme is open-ended — *anything goes* — so the entry turns that permission inward: the tower is a **lawless jumble** of rooms, floors, and encounters obeying no single logic. "Anything goes" *in the dark*. |
| **Defining hook** | **The candle is your clock, your health, and your map.** Every turn burns wax; the reveal radius shrinks as wax falls; at zero wax the flame gutters and Count Orlok closes. |
| **Primary pressure** | **Dread Weather** — a single tower-wide 0–8 tug-of-war dial. Cold acts raise it (buying light now); warm acts lower it (spending light now). Dread sets survivors' wariness and Orlok's closing speed. |
| **Win** | Find each floor's **key** to open the way down; hold the **ground-floor key**, reach the **ground-floor exit**, escape on your own light (**full**). Or slip through a survivor's **borrowed door** (lesser ending, reduced score). |
| **Lose** | The **only death is Orlok by wax-out** — and only after the guttering-dark grace is spent. |
| **Target audience** | 13+; players who like atmospheric, decision-driven horror, resource tension, and emergent social systems. Runs ~5–8 minutes (~75–100 turns). |
| **Session shape** | One run = one descent, Spire (top) → ground floor. Replayable via seed variation and route/social choices. |

---

## 2. Core Loop and Level Design

### 2.1 The core loop (turn-based, grid, touch-first)

One turn = **one wax burn** (1 wax, from the template `resources.wax.burn_per_turn`). A turn is any of: move one tile, wait, take/use an item, resolve an encounter action, or perform a social action.

1. **Move / act** — tap an adjacent tile or choose an action. Turn paid in wax.
2. **Reveal** — the candle lights a fixed radius (`candle_radius`, start 3, max 7, scales with wax). Everything outside the radius is absolute black. Exploring costs light; not exploring finds nothing.
3. **Encounter** — entering a room may trigger an **exploration** (with an intrinsic **trap**), **avoidance-combat**, or **social** scene (archetype + roster driven from `window.TEMPLATE`).
4. **Resolve** — spend/gain wax and matches, gain lore/loot, change NPC disposition, shift Dread.
5. **Survive** — keep the candle lit, find each floor's key, reach the exit before wax-out.

### 2.2 The descent and the tower

- **Descent:** wake at the **Spire** (top floor) and work **down** to the **ground floor**, where the only exit is. Vertical movement uses declared `down`/`up` exits. "Floor 1" for pacing = the **first floor played** = the Spire.
- **Generated, not authored:** each floor is generated at runtime from `window.TEMPLATE` (archetypes + connectivity + thing/encounter roster), seeded by `window.SEED` (default random; `test_seed = 20261010` honored; Phase 2 pins it).
- **Per-depth generation:** each floor is generated **once** from `hash(seed, depth)`, **cached**, and **mutated in place**. Backtracking returns the floor you changed, not a fresh one. `worldState()` reports the **active floor**; runtime mutations are a delta on top of the pristine boot state (the Spire).
- **Winding, not a stack:** a floor is a graph — several stairwells, loops, dead ends, and the occasional stair that skips a tier ("anything goes" geometry). Routing is a real choice: the fast stair, the wax-rich stair, or the stair a survivor camped.
- **Persistence & roaming:** survivors change floors like you — active where you are, "elsewhere" where you are not. Simulation is **active-floor-only**; state is **tower-wide**.

### 2.3 Archetypes and connectivity (read from `window.TEMPLATE`)

Every generated room carries its **archetype id**. The generator honors each archetype's `count` bounds **per floor** and the declared connectivity rules.

| Archetype id | Role | Count / floor | Things carried |
|---|---|---|---|
| `spire-entry` | entry | [1, 1] | — (start room; start archetype MUST be `spire-entry`) |
| `stair-corridor` | corridor | [2, 4] | — |
| `candle-nook` | treasure | [1, 2] | `wax-cake`, `matches`, `oil-vial` |
| `shadow-hall` | trap | [0, 3] | — |
| `scribe-alcove` | treasure | [0, 2] | — (the key + lore ride in the key room; trap-free) |
| `survivor-camp` | social | [0, 2] | — |
| `descending-stair` | exit | [1, 2] | — (the `down` gate is **locked** until the floor's `floor-key` is held) |

**Connectivity rules** (legal transitions): `entry -> corridor*`; `entry -> treasure`; `corridor -> corridor*`; `corridor -> treasure | trap | social`; `treasure | trap | social -> corridor*`; `corridor -> exit`; `exit -> down`. Vertical movement is `down`/`up`.

**Guarantees per floor:** `wax-cake`, `matches`, `lore-fragment`, and exactly one **`floor-key`** are placed and reachable from start. `trap`/`social` minima are 0 so the Spire (wax+exploration only) can never hard-fail the spatial gate.

**The key model — one key per floor (the single door rule).** Each floor holds **exactly one `floor-key`**; the floor's `down` stair gate stays locked until you hold it. **Floor 1 (Spire)** places its key in the guaranteed treasure room (`candle-nook`, adjacent to the entry); **floors 2–6** place it in the **first** treasure room (`scribe-alcove`), together with the required `lore-fragment`. **Invariant:** no required thing sits in a creature/**trap** room — a trap room is a skippable leaf on the floor graph, never a bridge on the required path, so it is never required for progress. The key is **consumed by descending** — the next floor starts keyless. On the **ground floor the key *is* the exit key**: hold it and reach the exit for the full win. There is no "forcing" — a locked gate only ever opens with that floor's key.

### 2.4 Floor-by-floor escalation (applied BY THE GAME, by depth — the template is floor-agnostic)

**Exactly one new variable per floor.** Individual creature behaviour never changes; escalation is **density and mix**, never stats.

| # | Floor | New variable this floor | Creatures | Traps | NPCs | Notes |
|---|---|---|---|---|---|---|
| 1 | **Spire** (first played) | *(none — tutorial)* | `bats` (threat 1, `wax-spill`) | — | **none** | Wax + exploration only. **No social, Dread frozen at 0.** Generous: one extra `candle-nook` guaranteed within 2 moves; extra wax/matches. First success well inside 30 s. |
| 2 | Descent A | **NPC pressure** (social + Dread arrive) | `rats` (match-destroy) | `pressure-plate` | `vlask` (−1), `sister-marta` (0), `petr` (+1) | Dread ticks begin. New NPCs start at template disposition **modified by Dread tier**. First floor with traps and the keyed treasure room. |
| 3 | Descent B | **Creature density** | `spiders` (turn-cost), +1 creature per room | `collapsing-floor`, `snap-trap`, `spider-web` | `ilona` (−1), `nadja` (−1) join | Roster widens; traps escalate by density/region. `spider-web` is a companion event (adjacent to a `spiders` room). |
| 4 | Descent C | **Trap density** | `wolves` (run-wax-spill, threat 3) | `light-glyph` | roamers | Trap density up over the floor-3 baseline; creature + trap share one per-floor budget. |
| 5 | Descent D | **Darkness** | `shades` (wax-drain, threat 3) | `cursed-ward` | roamers | **Baseline candle radius −1**; occasional unlit rooms; the smaller radius also brings Orlok nearer. |
| 6 | **Ground floor** | **Wax drain** | `light-eater` (snuff, threat 4) | — (existing types at higher density) | roamers + exit race | **Ambient drain: on turns ≡ 0 (mod 6), lose 1 extra wax.** The exit door is here. Orlok pressure highest. |

- **Dread is the one pressure that escalates with *play*, not floor.** Floor 1 freezes it; it moves only from floor 2 down.
- **Traps escalate by density and region, not one-per-floor.** New trap types enter by tier and existing ones re-appear more often; a floor's **creature + trap escalation draws a single budget** so the two never double up.
- Each floor has **exactly one guaranteed refill room** (`candle-nook`), so a floor is ~15–20 productive turns at ~1 burn/turn. **Run budget:** ~5–8 min, ~75–100 turns, wax pool ~32 + refills (cap 40, so refills bank). *(Autoplay 2026-10-11: a no-map greedy player completes 94% of 50 seeds within budget.)*

### 2.5 Encounters (avoidance combat — no HP, no attack rolls)

Entering a creature/trap/NPC room triggers a scene. Creatures and traps are **decisions, not HP-sponges**.

**Avoidance menu (creature encounters):**
- **Run** — escape, but **spills wax** (the creature's `effect`, e.g. `wax-spill`). The candle stays lit.
- **Endure / be spooked** — **snuffs the candle** and costs **no wax**; the flame returns only when you spend a **`match`** to re-light. With **no match in hand**, a snuff drops you into the **guttering-dark grace** (§2.8). Thematic "spooked" outcome, now a genuine fuel-vs-match trade.

| Creature | Threat | Effect | First floor |
|---|---|---|---|
| `bats` | 1 | wax-spill | 1 |
| `rats` | 1 | match-destroy | 2 |
| `spiders` | 2 | turn-cost | 3 |
| `wolves` | 3 | run-wax-spill | 4 |
| `shades` | 3 | wax-drain | 5 |
| `light-eater` | 4 | snuff | 6 |

**Traps** are **turn-and-light problems, not reflex tests** — a wrong choice costs wax or a match, never a life. Each trap is a tax with two doors: **Avoid → costs wax** (the safe route exists by construction but is longer, so dodging burns turns, and turns are wax) or **Spring → snuffs the candle + costs a match** to re-light. The change `armed → sprung` **persists** (a sprung trap is a permanent edit to the floor, never fresh on return). Every trap is **intrinsically telegraphed** inside the spill ring (a hairline crack, a glyph's faint pulse, settling dust) — never a hidden gotcha, and it reads with SFX off. A trap room is **never required for progress** (a skippable leaf, never a bridge), so a trap can only lengthen a route, never strand you from the key, the exit, or a refill. The **six traps** (all `kind:"trap"`, sharing a per-floor budget with creatures, §2.4): `pressure-plate`, `collapsing-floor`, `snap-trap`, `spider-web`, `light-glyph`, `cursed-ward`. The `spider-web` trap is a **companion event** — its room is placed **adjacent to a room hosting the `spiders` creature** (`companion:"spiders"`). *(The former `locked-door` "force the door" puzzle and the `light-trap`/`dark-leap` puzzles are retired: the keyed `down` stair gate replaces the lock, and traps replace puzzles entirely.)*

**Count Orlok is deliberately excluded from the encounter roster** — he is never rolled into a normal encounter. Instead he is **always visible from turn 1**, riding the mask's edge: at a full radius and low Dread he hangs at the far rim of the spill ring; as wax falls (the radius closes) and as Dread climbs he drifts inward, looming larger and nearer, his scale and inward offset tracking the threat state. He never crosses the light — only a wax-out (or a snuff with no match) lets him close the last of the dark and take you (§2.8).

### 2.6 Social layer (arrives floor 2, never on the Spire)

**Five recurring survivors**, each a distinct disposition **pole**, each roaming floor-to-floor. An encounter opens on **same-room co-location**. NPCs are **seen on the map only while inside your candle radius** — drawn full-brightness like you inside the radius, resolving to a silhouette in the spill ring, invisible outside (the dark hides them exactly as it hides everything else). Orlok is the one exception: he rides the mask's edge at all times and is never hidden by the dark.

| NPC | Pole | Start dispo / numeric | Goals (from template) | Voice |
|---|---|---|---|---|
| **Vlask** | hoarder (cold possession) | wary / −1 | guard the wax cache; hoard light; never lend a match | low, clipped, counts everything aloud |
| **Sister Marta** | archivist (knowledge) | neutral / 0 | preserve knowledge; trade lore/info, never light | measured, archival, patient |
| **Ilona** | bitten (the dark's bargain) | suspicious / −1 | reach the door; sell the dark's knowledge at a price | a wheeze under every word |
| **Petr** | innocent (warmth's wager) | friendly / +1 | stay alive and kind; follow someone braver | young, uneven, a hum he cannot quiet |
| **Nadja** | rival (tomb-robber) | wary / −1 | reach the door first; strip the tower; win every trade | bright, quick, transactional |

**Disposition scale:** `[hostile, suspicious, wary, neutral, friendly, allied]` ↔ **numeric −2…+2**.

**Dread sets survivors' *starting* disposition per floor.** From the template NPC's base numeric, apply the Dread tier offset (§2.7): e.g. at **Watched** (2–3) new NPCs start one step warier; at **Hunted-full** (8) every NPC reads **Hostile** until atonement.

**The six social actions** (warm → cold; exactly the template's `social_actions`):

| Action | Polarity | Dread Δ | Disposition Δ | Wax Δ |
|---|---|---|---|---|
| **Share light** | warm | −1 | [0, +2] | −2 (give wax now) |
| **Ally** | warm | −1 | [0, +2] | −1 (sustained shared radius) |
| **Bargain** | warm | 0 | [−1, +1] | 0 (lore/info exchange; **never wax/matches**) |
| **Trade** | warm | 0 | [0, 0] | 0 (even swap) |
| **Steal** | cold | +1 | [−2, 0] | +2 |
| **Threaten** | cold | +1 | [−2, 0] | +1 |

**Balance:** *warmth buys light later; cruelty buys light now.* Warm acts cost wax and lower Dread; cold acts give instant light and raise Dread (accelerating Orlok). **Lore never buys wax or matches** — it buys disposition, a **floor/stair layout hint** (where the key, a refill, or the fast stair is — saving exploration, hence wax), or safe passage, bounded by the per-NPC disposition cap.

**Social wax budget (beginner-safe, brief-mandated):** cumulative **wax spent on social actions is capped at 7** (≤~22% of the starting pool of 32). Once the cap is reached, wax-costing warm acts are disabled for the rest of the run; free acts (`bargain`, `trade`) and cold acts remain available. Refills do **not** raise the cap. Warm acts stay affordable at every Dread tier, so **atonement is never wax-unaffordable and Dread never hard-locks the player**.

### 2.7 Dread Weather — the 0–8 tug-of-war dial

Authored twice in the template: as lore `key: dread-dial` (world model) and as the `clocks[]` `tug_of_war` entry (game + checker). Tower-wide, shared. **Frozen at 0 on the Spire.**

| Tier | Range | State | Effect (number decided here) |
|---|---|---|---|
| T0 | 0–1 | **Calm** | New NPCs start at template disposition. Orlok baseline. Grace = **5** turns. |
| T1 | 2–3 | **Watched** | New NPCs start **1 step warier** (numeric −1 floor). Grace = **4**. |
| T2 | 4–5 | **Marked** | Warm acts draw the dark closer: **+1 extra Dread after a warm act** at this tier and above. Grace = **3**. |
| T3 | 6–7 | **Hunted** | No new **Ally** (cap +2) without first performing a warm act on the current floor. Grace = **2**. |
| T4 | 8 | **Hunted (full)** | Every NPC reads **Hostile (−2)** until atonement. `orlok-lock` fires. Grace = **1**. |

- Dread reads as **weather**: it colours the frame, starts strangers warier, and sets Orlok's closing speed during the guttering dark. It is **not** a per-deed ledger.
- **Atonement always available:** warm acts (and any Dread-lowering path) still work at every tier, so a cold-built run can always claw back.

### 2.8 Snuff vs. guttering dark vs. death (fail-forward)

- **Snuff** (a creature or a `trap` snuffs the candle, `light-eater` fires, or you **Endure**): darkness you **recover from** — you are **not** dead unless wax is gone. Radius collapses to 1; spend a `match` to re-light. A re-light **restores the flame only — it never adds wax** (light ≠ fuel). With **no `match` in hand**, a snuff is not recoverable and drops you straight into the **guttering-dark grace** below. Visually/audibly a **hard instant blackout** + a lone match-strike.
- **Guttering dark** (wax = 0, or a snuff with no match): the terminal *act*, not the game-over screen. Radius = 1, Orlok's footsteps converge. You have a **grace window** of turns (set by Dread tier, §2.7). A `match` spent here buys **exactly one more grace turn** (the flame stays lit; guttering persists) — it never ends the guttering dark and never adds wax; only **wax** (a `wax-cake` pickup) ends it, or the **exit**. Slow wobble + swelling drone — visibly/audibly **distinct from a snuff**.
- **Death:** only when the grace turns are spent **and** Orlok reaches you. `resource.wax.gutters_at = 0`. **Count Orlok is triggered only by wax-out; Dread sets how fast he closes.** At Dread 8, `orlok-lock` means Grace = 1.

### 2.9 Win, borrowed door, and score

- **Full win:** hold the **ground floor's `floor-key`**, reach the ground-floor exit, escape on your own light. Highest score.
- **Borrowed win:** a survivor who reaches the door first leaves it **ajar** for a window; slipping out is the lesser ending *"you slipped out in another's wake"* with a **reduced score**. While it stands open, **Dread +1 per 2 turns** and creatures gather near the exit.
  - **Borrowed-door window** = `clamp(dispo_turns − floor(Dread / 2), 1, 6)` turns, where `dispo_turns`: allied(+2)=5, friendly(+1)=4, neutral(0)=3, wary/suspicious(−1)=2, hostile(−2)=1. A warm ally at low Dread holds it longest; a hostile at high Dread barely at all.
  - **Fixed-count fallback:** if the social layer is cut, the window is a **fixed 3 turns**.
- **Key remains the reliable, self-reliant path.**

**Score model (points):**

| Award | Points |
|---|---|
| Full escape (own light) | **1000** |
| Borrowed-door escape | **400** (reduced) |
| Wax remaining at escape (full only) | **+10 / wax** |
| Matches remaining | **+25 / match** |
| Lore fragments collected | **+75 / fragment** |
| Warm acts performed | **+30 each** |
| Cold acts performed | **−20 each** |
| **Zone Bonus** — first entry to each new floor | **+100 / floor** (Spire counts; up to +500) |
| **Near-Miss Bonus** — grazing a creature, clearing a trap as it gives way, or escaping a room at wax ≤ 3 | **+50 each** |

---

## 3. CONTROLS

Touch and mouse are **both required** (per COMPLIANCE). Keyboard is layered on for this "full controls" run.

### 3.1 Touch (mandatory)
- **`touchstart` / `touchmove` / `touchend`** on the canvas.
- **Tap an adjacent tile** → move one tile (burns 1 wax).
- **Tap a UI target** (Run / Endure buttons, social panel, inventory) → act.
- **Swipe left/right** on a side panel to open/close the action tray (optional gesture; taps always work).
- **Long-press a tile** → inspect/tooltip (free, no turn).
- Finger-sized targets throughout: **hit areas ≥ 48 px**.

### 3.2 Mouse (mandatory)
- **`mousedown` / `mousemove` / `mouseup`** on the canvas.
- **Click** → move/act identically to tap.
- **Hover** → highlights the reachable tile and previews its cost (e.g. "−1 wax").
- Panel buttons use normal click semantics.

### 3.3 Keyboard (enabled this run)
- **WASD / Arrow keys** → move one tile (adjacent, grid-adjacent moves only).
- **Space** → **wait / confirm** (burns 1 wax). In an encounter, Space confirms the highlighted option.
- **Esc** → open/close Pause.
- **1–6** → select social action 1–6 when a social panel is open.

### 3.4 Input zones / reachability
- Only **grid-adjacent** tiles are actionable; illegal tiles are visually inert and cost nothing.
- **Immediate, responsive feedback:** a tile commits on `touchend`/`mouseup` within the tap radius; the turn resolves in the same frame; the wax meter and radius update immediately. Hover/touch-down highlights the target *before* commit.
- No drag-to-path, no twitch input — every action is a discrete, confirmable choice (preserves the calm, decision-driven pace).

---

## 4. MECHANICS

### 4.1 Primary and secondary mechanics
- **Primary:** *candle-as-clock* — wax is clock, health, and map at once. Every turn burns it; low wax shrinks the reveal radius; zero wax begins the guttering dark.
- **Secondary:** *Dread Weather* — the tower-wide 0–8 social dial that sets survivor wariness and Orlok's closing speed; warm/cold actions are survival choices.
- **Resource interaction:** wax ↔ (matches, key, radius, Dread, lore). **Lore is non-survival and never buys wax or matches.**
- **Avoidance combat:** Run / Endure; no HP, no attack rolls; creatures cost light and decisions.
- **Social:** 6 actions, disposition −2…+2, two poles; compounded only if an alliance survives.

### 4.2 Resources (from `window.TEMPLATE.resources`)
| Resource | Start / bounds | Role |
|---|---|---|
| **wax** | start 32 / max 40 / min 0 / **burn 1/turn** / gutters at 0 | clock, health, map |
| **matches** | start 2 / max 6 | re-light a **snuff** (adds no wax); during the guttering dark it buys one more grace turn |
| **key** | start 0 → one `floor-key` per floor; win condition | opens the floor's `down` gate; the ground-floor key opens the exit |
| **candle_radius** | start 3 / max 7 / scales with wax (flattened curve) | reveal radius in tiles (see formula below) |
| **Dread** | 0–8 tug-of-war | weather; NPC wariness + Orlok speed |
| **lore** | collected, readable, unique per archetype/floor | score + standing; **never** wax/matches |

**Radius formula (design decision — flattened, visibility-first):** `base = candle_radius tier (3, +upgrades to max 7)`. Effective radius = `clamp(base − penalty(wax), min(base, 2), base)`, with the **flattened** penalty curve: **0 for wax ≥ 18, 1 for 6–17, 2 for 1–5**. So the frame closes in as the wax burns but **never drops below radius 2** while the flame is lit — the flame stays a usable map even at low wax. (The prior curve collapsed to radius 1 for wax ≤ 17, which read as "not enough wax" when it was really near-blindness. The curve is a runtime-tunable `window.TUNING` value so the harness can A/B it; the chosen curve is stored in `resources.candle_radius.penalty`.)

**Refill (`wax-cake`):** restores the candle by **+14 wax** (capped at 40) and counts as the floor's guaranteed refill room. **`matches` pickup:** +1 match. *(Data: 2026-10-11 autoplay — raising the cap so refills **bank** lifted a no-map greedy player from 74% to 94% completion; the binding constraint was the 30-wax cap wasting refills, not the refill amount. See `playtest_ab_summary.txt`.)*

### 4.3 Win / lose conditions
- **Win:** find and hold the **ground-floor key**, exit the ground floor (full) **or** through a survivor's borrowed door (lesser). Reaching the exit is always a win — including during the guttering dark.
- **Lose:** the only death is **Orlok by wax-out** after the grace window is spent. No HP, no combat death, no trap death (traps/wrong answers cost wax, never a life).

### 4.4 DIFFICULTY BALANCE — BEGINNER-FRIENDLY & MOTIVATING (REQUIRED)

**Entry level (Floor 1 — the Spire):**
- **Extra-easy entry:** Spire places a guaranteed `candle-nook` (wax + matches) **within 2 moves** of `spire-entry`; only `bats` (threat 1) spawn; wide corridors; **no social, Dread frozen**. Extra starting wax/matches on the Spire.
- **Controls at start:** direct and responsive — tap/click an adjacent tile; **one action, one clear result**. No timing, no combos, no hidden rules.
- **First success < 30 s:** the opening beat teaches *"find wax, keep the flame."* Finding the first wax-cake / saving the candle fires a **"WAX FOUND"** score pop. Reachable in **~10–20 s** (2 moves + resolve). This beat is the designed 30-second win.
- **Near-Miss Bonus (+50):** rewards grazing a creature, clearing a trap as it gives way, or escaping a room at wax ≤ 3.
- **Zone Bonus (+100):** awarded on first entry to each new floor — a visible sense of progression.

**Progression — LINEAR, not exponential:**
- **Learning phase (floors 1–2):** generous gaps, moderate creature density, few types (bats → +rats), Dread only beginning to move.
- **Challenge phase (floors 3–6):** tighter routing, more types, **one new variable per floor** (§2.4) — never two new systems at once.
- Difficulty rises with **depth** (density, drain, darkness, trap frequency) and with **Dread** (play-driven). It never spikes: a floor never doubles a prior floor's pressure, and warm acts always remain affordable.

### 4.5 Scoring system
The score model in §2.9 applies. **Near-Miss Bonus (+50)** and **Zone Bonus (+100/floor)** are first-class, always-available rewards. Score is shown live in the Victory breakdown; death shows the score earned before Orlok closed.

---

## 5. VISUAL STYLE

**Signature:** *the light is the artwork.* There is no lit room behind a mask — the world is a **radial candle mask over absolute black**, and the reveal itself is the spectacle. Compose every frame around the flame, never around the room.

- **Palette (≤ 3 hues on screen):** absolute black `#000` void; candle **amber → gold** core with warm falloff; cold desaturated **grey-blue** stone at the radius edge; **arterial red reserved for Orlok, blood, and danger only**. The void never drifts to grey — the known/unknown border must read instantly.
- **Light & falloff:** radial gradient mask with a soft edge, plus a dimmer **spill ring** just outside the main radius so near-things resolve before they pop in. Radius tied to wax (it closes in as the candle burns).
- **Flame as a character:** irregular low-amplitude flicker at rest; **guttering** = slow wobble near zero wax; **snuff** = hard instant blackout (visually distinct from the slow guttering dark). Flame leans toward movement and toward the room's neighbour.
- **Gothic vocabulary:** arches, iron sconces, caged stairwells, warped Expressionist angles, ancestral portraits whose eyes track the flame; 1922 *Nosferatu* look — stark geometric shadows, low-key light, long clawed silhouettes. In a small radius, **silhouette reads better than detail**.
- **Readability (375 px hard floor):** every threat identifiable from its silhouette at the radius edge; **tiles ≥ 48 px**; never rely on fine detail to signal danger.
- **Weather legibility:** wax and Dread read as atmosphere — darkness colour/saturation shifts with Dread tier; near-miss and damage flash red on the mask edge.
- **Motion (reserved):** turn-based → movement is punctuation: a 1-tile camera glide, a slow "breathing" pulse on the void, nothing that competes with the flame.

---

## 6. AUDIO DIRECTION

**Rule zero — silence is a tool.** Keep the ambient bed at the edge of hearing so a *cut to silence* is itself an event.

- **The clock you hear:** a consuming fire/tick per wax burn, imperceptibly faster as wax drops — the player *feels* the turn cost before reading the meter. Killing the tick is the zero-wax cue.
- **The drone:** one pervasive low-frequency drone (sub-bass + detuned sines) from turn 1, **rising with Dread tier** — the tower's mood is audible. Music, if any, stays non-diegetic, sparse, reserved for terminal beats.
- **Direction & distance:** creature cues (bat squeaks, rat scurry, wolf howl, shade whisper) panned by direction, attenuated by distance, **quieter outside the radius**. Orlok's footsteps are the one thing that grows **louder** as light fails.
- **Traps have a voice:** each trap type carries a distinct cue — stone grind (`collapsing-floor`), a coiled *click* (`snap-trap`), a dry chitinous rustle (`spider-web`), a mechanism *thunk* (`pressure-plate`), a low glyph tone (`light-glyph`, `cursed-ward`) — panned and attenuated like creature cues, **quieter outside the radius**, and audible inside the spill ring before you commit. Every trap's telegraph reads even with SFX off. A trap **snuff** uses the sharp snuff cutoff, never the slow guttering swell. Exposed to the audio harness as `window.audioTest('trap', seed)` with a `trap` entry in `window.AUDIO_SPEC`.
- **Escalation arc:** *snuff* = sharp cutoff + lone match-strike; *guttering dark* = drone swells, heartbeat enters, Orlok's theme resolves; *death* = drone stops dead.
- **Voices:** five survivors need distinct, minimal voices (a hum, a wheeze, a whisper) so disposition changes are audible without dialogue; speech low-passed and close.
- **Mix & budget:** Web Audio, procedural where possible (oscillators + noise, no sample assets) to keep the single file light; duck ambience under Orlok's theme. **Music/SFX toggles in Pause and Settings.**

---

## 7. GAME STATES

```
BOOT → TITLE ⇄ HOW_TO_PLAY → GAMEPLAY ⇄ { ENCOUNTER overlay, SOCIAL overlay,
        INVENTORY/JOURNAL overlay } ⇄ PAUSE → { SETTINGS, HOW_TO_PLAY, TITLE }
GAMEPLAY → GUTTERING_DARK (fail-forward sub-state) → VICTORY | GAME_OVER
```

| State | Entry | Exit |
|---|---|---|
| `BOOT` | load; parse `window.TEMPLATE`; seed from `window.SEED` | Title (or straight to Gameplay if auto-run) |
| `TITLE` | logo, Start, How to Play | Gameplay, How to Play, Settings |
| `HOW_TO_PLAY` | from Title/Pause | back to opener |
| `SETTINGS` | from Title/Pause | back to opener |
| `GAMEPLAY` | Start | Pause, Encounter, Social, Victory, Game Over |
| `PAUSE` | Esc / Pause button | resume, How to Play, Settings, Title |
| `GUTTERING_DARK` | wax hit 0 | recover (match/exit) or Game Over |
| `VICTORY` | reach exit (full or borrowed) | Title, Retry |
| `GAME_OVER` | grace spent + Orlok arrives | Retry, Title |

Encounter/social/journal are **in-scene overlays** over Gameplay, not counted as screens.

---

## 8. USER INTERFACE and Screen Inventory

**Seven screens** (≥ 6 required). All AGENTS must-haves present: Pause has music toggle, SFX toggle, How to Play, back, and resume.

### Screen 1 — Title
- Game **logo** ("TORRE NOSFERATU").
- **Start** button.
- **How to Play** button.
- *(secondary)* Settings, and a small "seeded run: <seed>" line.

### Screen 2 — How to Play
Clear, beginner-friendly instructions for **all** controls and every mechanic:
- **The candle is your clock, health, and map.** Every turn burns 1 wax. Below it: radius shrinks (but never below 2 tiles while lit); at 0 wax the guttering dark begins.
- **Move:** tap/click an adjacent tile (or WASD/arrows). **One move = one wax.**
- **One key per floor.** Find the floor's **key**, then reach the **Descending Stair** and press **Descend**. The stair gate stays locked until you hold that floor's key.
- **Run / Endure** at creature encounters: **Run** costs **wax** (candle stays lit); **Endure** **snuffs the candle** (no wax) — spend a **match** to re-light. No match, no light.
- **Matches** re-light a snuff (they do not add wax); on the ground floor the **key** also opens the exit.
- **Warm / cold actions** at survivors: warm lowers Dread and costs light; cold buys light and raises Dread.
- **Dread (0–8)** reads as weather; it sets how fast Orlok closes.
- Touch controls and mouse controls explained side by side; keyboard listed.

### Screen 3 — Gameplay
- **HUD:** **wax meter** (with numeric), **matches** count, **key** indicator, and **Dread weather** read-out (tier name + 0–8 gauge).
- Active-floor map (revealed rooms only), the candle radius view, and the tile grid.
- Action tray: move affordance, item use, and (on floor 2+) a **Talk** affordance when co-located with a survivor.
- Overlays: encounter (Run/Endure), social (six actions + disposition), journal (lore, free/out-of-turn).

### Screen 4 — Pause Menu (MUST HAVE)
- **Resume Game** button.
- **Background music on/off toggle.**
- **Sound FX on/off toggle.**
- **How to Play** button (opens the instructions overlay).
- **Go back to Start Menu** button.
- **Quit** (to Title / close run).
- *(also reachable)* Settings.

### Screen 5 — Settings
- **Music toggle.**
- **SFX toggle.**
- **Reset run** (re-seed; with confirm).
- **Credits.**
- Keyboard/touch hint toggles.

### Screen 6 — Game Over
- **"Count Orlok takes you."**
- Final score earned so far; seed; floor reached.
- **Retry** / **Back to Title**.

### Screen 7 — Victory
- Escape (full **or** borrowed) banner: *"You escaped on your own light"* vs *"You slipped out in another's wake."*
- **Score breakdown:** full/borrowed base, wax remaining, matches, lore, warm/cold acts, zone bonuses, near-miss bonuses; total.
- **Play again (new seed)** / **Back to Title**.

---

## 9. MONETIZATION / SCOPE

**FREE-TO-PLAY WITH NO MONETIZATION.**
- No ads, no IAP, no paid unlocks, no currency, no energy timers, no external calls, no accounts, no analytics/telemetry.
- Entirely client-side; single embedded `index.html`; deployable to itch.io as-is.
- Scope is fixed to the jam build: 6 floors, 6 creature types, 6 trap types, 5 NPCs, 6 social actions, 7 screens.

---

## 10. IMPLEMENTATION NOTES

### 10.1 Single-file & contract
- One `index.html`; vanilla JS only; all HTML/CSS/JS embedded.
- `<meta name="viewport">` required; responsive canvas scales to viewport; touch targets ≥ 48 px.
- `world_template.json` embedded as **`window.TEMPLATE`** via `<script type="application/json">` (safe: authored strings may contain `</script>`).
- **Every system reads from `window.TEMPLATE`** — archetypes, connectivity, required things/encounters, resources, clocks (wax + Dread tiers/effects), NPCs, social actions, encounter roster. **Nothing hard-coded.** The GDD's numbers are realized as defaults the game maps onto template fields.

### 10.2 Required hooks (exposed to the Phase 2 checker)
- `window.TEMPLATE` — the embedded template (verbatim).
- `window.SEED` — defaults random; pinning `TEMPLATE.test_seed` (20261010) yields a known layout. `test_seed` is honored when present.
- `window.worldState()` — the **active floor's** generated rooms, each tagged with its **archetype id**, plus exits and things.
- `window.systemState()` — **tower-wide** at all times: survivor roster + Dread clock + encounter roster (so every encounter id, incl. lower-floor ones, appears even when it roams elsewhere).
- `window.move(dir)` — thin wrapper over the same move handler the UI uses.
- `window.social(id)` — thin wrapper over the same social handler the UI uses.
- A **pristine boot-state hook** so the checker validates pre-mutation state (the Spire).

### 10.3 Seeded multi-floor generation
- Each floor generated **once** from `hash(seed, depth)`, **cached**, and **mutated in place** (mutations are a delta). Backtracking returns the changed floor.
- Vertical movement via declared `down`/`up` exits. `worldState()` reports the active floor; `systemState()` is tower-wide.
- Start room archetype MUST be `spire-entry`; per-archetype `count` bounds honored; required things reachable from start; `required_encounters` (`bats` f1, `vlask` f2, `rats` f2) placed and reachable.

### 10.4 Staged delivery (all three waves ship; wave 3 required)

| Wave | Content | Runtime flag |
|---|---|---|
| **1 — Descent core** | turn-based grid, candle-as-clock, wax/matches/key, radius reveal, seeded winding floors, Run/Endure, one creature type (`bats`), the `collapsing-floor` trap | always on |
| **2 — Social + Dread** | five survivors, disposition, six social actions, 0–8 Dread dial wired to wariness + Orlok speed, borrowed door, and the remaining five traps (`snap-trap`, `spider-web`, `light-glyph`, `pressure-plate`, `cursed-ward`) by density | always on |
| **3 — Shared-resource survivor sim (REQUIRED)** | NPCs carry/split light, can be harmed, take/use items; collapsing alliances collapse your radius | see flags |

**Wave-3 sub-features are independently flag-gated** (the `juiceEnabled` pattern) so a flaky sub-feature disables at runtime **without breaking the build** — graceful degradation, never a blanket cut:

| Flag | Sub-feature | Default |
|---|---|---|
| `flags.npcItemUse` | NPCs take/use items (and spend wax they carry) | `true` |
| `flags.creatureAttacksNpc` | Creatures attack NPCs (allies can be harmed/lost) | `true` |
| `flags.npcTrapTrip` | NPCs trip traps (springing a trap they trigger; `armed → sprung` persists) | `true` |
| `flags.allianceRadius` | Allied survivor widens radius / splits wax drain; collapse shrinks it | `true` |

**FROZEN HOOKS — flags may NOT gate:**
- `window.social(id)` (must always resolve for any valid id),
- any **required encounter** (`bats`, `vlask`, `rats`, and the rest of the template roster),
- **NPC state** (roster/disposition) or **Dread state** (the dial always updates).

Disabled flags degrade *simulation detail only*, never the required contract. If the **entire social layer** is cut, the borrowed-door window falls back to a **fixed 3 turns** (§2.9).

### 10.5 Runtime safety
- All systems initialized from `window.TEMPLATE`; missing optional fields fall back to documented defaults, never throw.
- Game loop is turn-driven (no physics/frame-critical state); no infinite loops; state transitions are explicit.
- Audio uses Web Audio with a user-gesture unlock; procedural only.

---

## 11. BRIEF MUST-HAVES ACCEPTANCE CHECKLIST (`direction.txt` §15)

### Must

| # | Brief must-have (§15) | How this GDD satisfies it |
|---|---|---|
| M1 | Single `index.html`, vanilla JS, embedded HTML/CSS/JS | §9, §10.1 |
| M2 | Candle-as-clock; wax/matches/key | §2.1, §2.2, §4.1–4.2 |
| M3 | Grace on wax-out | §2.7 (grace 5/4/3/2/1 by Dread tier), §2.8 |
| M4 | Five NPCs | §2.6 (Vlask, Sister Marta, Ilona, Petr, Nadja) |
| M5 | ~6 social actions | §2.6 (exactly the template's 6) |
| M6 | Single 0–8 Dread dial | §2.7 (tiers Calm→Hunted-full; `orlok-lock` at 8) |
| M7 | Avoidance combat (no battle system) | §2.5 (Run/Endure; no HP/attack rolls) |
| M8 | Touch + mouse; responsive; ≥ 6 screens; music/SFX toggles | §3 (both mandatory), §8 (7 screens; toggles in Pause + Settings) |
| M9 | **Staged delivery** wave 1 descent core / wave 2 social+Dread / wave 3 shared-resource sim | §10.4 (all three waves ship) |
| M10 | **Wave 3 required**, sub-features independently flag-gated | §10.4 (`npcItemUse`, `creatureAttacksNpc`, `npcTrapTrip`, `allianceRadius`; graceful degradation) |
| M11 | Social-cut → borrowed-door falls back to fixed short count | §2.9 (fixed **3 turns**) |
| M12 | Lore wave 1 readable/score; wave 2 social key; never wax/matches | §2.6, §4.2, §5.1-lore remit; `Bargain`/`Trade` use lore; score **+75/fragment** |

### Must not

| # | Brief must-not | How this GDD avoids it |
|---|---|---|
| N1 | No traditional fight-the-monster battle system | §2.5 — creatures are Run/Endure decisions; no HP, no attack rolls |
| N2 | No hand-authored `index.html`; no bypassing the approval gate | §9/§10 — agent output; approval gate already fired (human picked #14) |
| N3 | No hard death contradicting beginner first-success | §2.8 — only death is Orlok by wax-out *after* grace; §4.4 first success ~10–20 s |

### Agent acceptance checklist (descent / Dread / wax / ending / staging)

| Item | Status | Where |
|---|---|---|
| Game is a **descent** (top → ground-floor exit) | ✅ | §2.2 |
| First floor played is **wax/exploration only** (no social, Dread frozen) | ✅ | §2.4 F1, §2.7 |
| **Five recurring survivors**, each a distinct pole (hoarder/archivist/bitten/innocent/rival), roaming floors | ✅ | §2.6 |
| Encounter opens on **same-room co-location** | ✅ | §2.6 |
| **Dread** = single tower-wide 0–8 tug-of-war; sets starting disposition per floor + Orlok closing speed | ✅ | §2.7 |
| **Wax budget:** one guaranteed refill room per floor | ✅ | §2.4, §4.2 |
| Social spend capped ≤ ~25% of run wax | ✅ | §2.6 (**cap 7 wax**) |
| First success inside 30 s | ✅ | §4.4 (**~10–20 s**) |
| **Only death is Orlok by wax-out** | ✅ | §2.8, N3 |
| Survivor's escape leaves exit ajar for a window set by disposition + Dread | ✅ | §2.9 (`clamp(dispo_turns − floor(Dread/2), 1, 6)`) |
| Lesser ending + score penalty; raises Dread / draws creatures | ✅ | §2.9 (400 vs 1000; Dread +1/2 turns) |
| Fixed-count fallback if social cut | ✅ | §2.9 (**3 turns**) |
| Staged delivery wave 1/2/3, wave 3 required | ✅ | §10.4 |
| Wave-3 sub-features independently flag-gated | ✅ | §10.4 |
| Frozen hooks: flags may not gate `social(id)`, required encounters, NPC/Dread state | ✅ | §10.4 |
| Multi-floor: down/up exits; floor generated once from `hash(seed, depth)`, cached + mutated in place | ✅ | §2.2, §10.3 |
| Full controls: touch + mouse mandatory; WASD/arrows/Space enabled | ✅ | §3 |

---

## 12. Design decisions the brief left to the GDD

The brief states "exact numbers live in the GDD" and leaves the following open. These are the values chosen:

| Decision | Value | Rationale |
|---|---|---|
| **Wax-out grace window by Dread tier** | Calm 5 / Watched 4 / Marked 3 / Hunted 2 / Hunted-full 1 turns | Encodes §2.7 "Dread sets how fast Orlok closes"; the concrete escalation the brief deferred. |
| **Borrowed-door window formula** | `clamp(dispo_turns − floor(Dread/2), 1, 6)`; dispo allied 5 / friendly 4 / neutral 3 / wary 2 / hostile 1; **fallback 3** | Turns §8's "depends on disposition + Dread" into a number; warm ally @ low Dread = longest. |
| **Social wax-spend cap** | **7 wax** cumulative per run (≤ ~25% of 30) | Satisfies the brief's "warm/social spend ≤ ~25% of the run's wax"; free + cold acts unaffected. |
| **Refill amount (`wax-cake`)** | **+14 wax** (cap 40); `matches` +1 | One guaranteed refill/floor at ~15–20 productive turns; data-driven: the cap was raised from 30 so floor refills **bank** rather than overspill (autoplay: greedy completion 74%→94%). |
| **Match value** | re-lights a **snuff** (adds no wax); during the **guttering dark** it buys exactly **one more grace turn** (guttering persists) | Makes a match a save against darkness, not a wax refill; keeps the Run(wax)-vs-Endure(match) trade honest and Orlok terminal. |
| **Candle radius formula** | `clamp(base − penalty(wax), min(base,2), base)`; **flattened** penalty 0 (≥18) / 1 (6–17) / 2 (1–5) | Visibility-first: the flame stays a usable map at low wax; the old curve collapsed to radius 1 for wax ≤ 17. Runtime-tunable via `window.TUNING` for A/B. |
| **Key model** | one `floor-key` per floor; the `down` gate is locked until held; consumed by descending; ground-floor key = exit key; floor 1 key in the refill/treasure room, floors 2–6 in the trap-free lore/treasure room | Replaces the old per-stair auto-`exit-key` (which re-granted "THE KEY" every floor) and the retired `locked-door` force gimmick. |
| **Dread tier mechanical effects** | ±1 starting disposition step (Watched+); +1 extra Dread after warm act (Marked+); no new Ally without atonement (Hunted); all Hostile + `orlok-lock` (Hunted-full) | Gives the tier table concrete teeth while keeping atonement always affordable (no hard-lock). |
| **Per-floor escalation assignment** | F2 NPC pressure · F3 creature density · F4 trap density · F5 darkness (−1 radius) · F6 wax drain (ambient −1 wax every 6 turns) | One new variable per floor, using all five brief-named variables across floors 2–6. |
| **Score values** | full 1000 / borrowed 400; +10/wax, +25/match, +75/lore, +30 warm, −20 cold; Zone +100/floor; Near-Miss +50/event | Fills in the brief's named bonuses with numbers (Near-Miss +50 fixed per AGENTS contract). |
| **Floor count** | **6 floors** (Spire + 5 down to ground) | Uses every creature's first-floor slot (bats→light-eater) exactly once. |

---

*End of Game Design Document — Torre Nosferatu (Dread Weather).*
