# Changelog

All notable changes to Holotron are documented here.
Format: date-stamped sections, bulleted entries.

## 2026-10-11 — World-model contract: connectivity demoted to non-normative documentation

- **`connectivity.rules` is documentation, not a contract.** The generator never consumes it
  (`genFloor()` reads archetypes/roster/NPCs/`required_encounters` only), `scripts/check_template.mjs`
  never enforces it, and the authored exemplar violates the declared grammar. Reworded
  `world_agent.md` (§Role, template contract), `gdd_agent.md` (§Input), and
  `world_template.schema.json` (`connectivity.rules` description) to state it is non-normative.
- **`ROADMAP.md` backlog.** Recorded the deferred world-model items (R2 Dread single-source, R4
  systemic hard gate, R5 native count-up spike, R6 template self-consistency, R7 contract entry point)
  each with a revisit trigger, and closed R1 (exemplar load-bearing) and the `exit-key`→`floor-key`
  rename as not-doing (evidence: `docs/grill-me/2026-10-11-holotron-world-model-stress-test.md`).

## 2026-10-11 — Torre Nosferatu: post-playtest revision + autoplay harness

- **New `scripts/autoplay/`** (zero-dependency, agent-invoked): `bot.js` plays the real
  `index.html` through public hooks (`worldState`/`systemState`/`testState`/`move`) + modal DOM
  clicks; `playtest.mjs` runs seed batches per policy and arm, writes `*.json` + `*_summary.txt`;
  `README.md` documents usage and the `playwright-cli`+Firefox preflight. Two policies
  (**optimal** = full-graph BFS, **greedy** = frontier/no-map-memory) and two radius arms
  (A flattened, B original) via a runtime `window.TUNING`.
- **`index.html` mechanics (from five playtest complaints):**
  - **One key per floor.** `exit-key` → per-floor **`floor-key`** (Spire: treasure room;
    floors 2-6: puzzle room); the floor's `down` stair is **locked** until held and the key is
    consumed by descending. Removes the repeating "THE KEY" toast and the ambiguous
    `locked-door` "force it" puzzle.
  - **Run = wax; Endure = snuff.** Endure now costs **no wax** and **snuffs**; a **match**
    re-lights (re-light adds **no wax**); a snuff with **0 matches** enters the guttering-dark
    grace. Removes Endure's strict domination.
  - **Flattened radius curve** (`window.TUNING`, radius floors at 2) — visibility-first.
  - **Wax pool 32 start / 40 max / refill +14** so floor refills **bank** instead of overspilling.
  - Added read-only `window.testState()` (harness accessor); `win`/`endGame`/`newRun` now close
    any open modal (a run could previously end with an encounter modal stuck open).
- **`gdd.md` / `world_template.json`+`.txt` / `world_map.json`+`.txt` / `visual_direction.txt`**
  updated to match (key model, Run/Endure, radius formula, wax numbers, roster minus `locked-door`,
  `required_things` += `floor-key`).
- **Verification:** `check_template.mjs --fail-on spatial` → **spatial 0, systemic 0, exit 0**;
  autoplay bar (greedy, arm A) **PASS** — 94 % completion, 43.8 % median surplus, 0 ghost keys
  (`gameotron_output/20261010_095651/playtest_ab*`). Stress-test:
  `docs/grill-me/2026-10-11-torre-nosferatu-autoplay-and-fixes-stress-test.md`.
- `PROCESS.md` §7.4a and `ROADMAP.md` updated. Docs + game; **no pipeline behavioral change**.

## 2026-10-10 — Reorient PROCESS.md to GAMEOTRON developers

- Reframed `PROCESS.md` as the dev-facing "documented fork" the Gameotron jam asks participants
  to publish: title/purpose rewritten for GAMEOTRON developers, a reading path added (Torre run
  §7 = submission; §2–§6 = baseline), and a curated **"Changes vs upstream GAMEOTRON"** table
  (artifact → change → rationale → `Holonovel`/`dependency-free`) added to §1. The exhaustive
  change list is deferred to this file to avoid drift.
- Added **§7.5 Reproduction (Torre Nosferatu)** — the submission-run path a reader can follow
  cold (`direction.txt` → approval gate → #14 → multi-floor `down`/`up` → B7/Phase-2 checks).
- Moved the judged process summary into `COMPLIANCE.md` as a self-contained section; the
  `COMPLIANCE.md` pointer no longer relies on `PROCESS.md`.
- Docs only; **no agent/pipeline behavioral change**. Section numbering preserved so the live
  anchors `ROADMAP.md:41` (§4.4) and `CHANGELOG.md` §4.4–§4.7 still resolve — frozen anchors in
  dated `docs/` and this changelog are intentional.
- Added `docs/plans/2026-10-10-process-doc-reorientation-plan.md` and
  `docs/grill-me/2026-10-10-process-doc-reorientation-stress-test.md`.

## 2026-10-10 — Jam-requirement interpretations codified in the pipeline

- Clarified three pipeline behaviors to match the Gameotron jam requirements as
  interpreted for this entry:
  - **Theme:** the official theme may be "Anything Goes" (unconstrained content), but a
    theme value is still recorded (`theme.txt`) and seeds ideation; a theme override
    (`with theme: X`) is sanctioned. Phase 1 kept.
  - **Concepts:** the 20 reviewed concepts are a pool to **choose from or adapt**; the
    mandatory approval gate is preserved.
  - **Deployment is opt-in:** the default run **hard-stops after Phase 5.5** and hands the
    playable `index.html` back for playtesting; `deployment_agent` runs only on an explicit
    request and stops before any `butler push` (which needs an explicit confirmation).
- Mirrored across `.opencode/agents/gameotron.md`, `AGENTS.md`, `README.md`, `PROCESS.md`
  (§4.7 + §6), and `juice_agent.md` (flow). Doc-only; no behavioral change to the agents.

## 2026-10-10 — Torre Nosferatu brief: visual direction + hazard system

- **§11 Visual direction** — deepened the visual-direction feed for `visual_agent`: concrete
  palette hex ramps (void / candle / stone / arterial-red), a three-pass compose model
  (void → world → mask), and new rules for depth-in-a-tiny-radius, procedural materials,
  HUD-in-idiom, and canvas technique. Existing constraints held (≤3 hues, 375 px floor, ≥48 px
  tiles).
- **§6.4 → hazard system** — promoted "Puzzles / traps / simple platforming" into a three-class
  system (**hazards / puzzles / movement**) with a data-driven 5-hazard roster (collapsing floor,
  light-glyph, pressure plate, cursed ward, crumbling stair). Cost grammar: **avoid = wax**,
  **spring = snuff + match**; hazards are **never on a cut-edge** (by construction), are
  intrinsically telegraphed in the spill ring, and cross blind via a **memory shadow** (no new
  verb). NPCs can spring hazards (persistent, **flag-gated**, wave 3). Patched §5 (matches
  double-duty), §8 (no-match snuff → guttering-dark grace, reconciling §5/§15), §9 (hazard
  density, one new hazard per floor, shared creature+hazard budget, dark rooms as an environment
  modifier), §12 (hazard cue voices), §14 (hazard authored as `encounter_roster kind:"hazard"`),
  §15 (hazard must-haves + wave staging). Pre-registered falsifier: a dominant branch → cut/tune.
- Added `"hazard"` to the `kind` enum of `required_encounters` and `encounter_roster` in
  `world_template.schema.json` (additive; `scripts/check_template.mjs` unaffected — it never
  branches on `kind`).
- Reconciled the Spire's role (pre-existing §7↔§9 tension): the first floor excludes social,
  Dread, and hazards but **may host the first teaching creature** (bats, §7). Reworded §6.5/§9/§14
  from "wax and exploration only" / "encounter-free".

## 2026-10-10 — Close the audio verification gap (pipeline hardening)

- Fixed a verification gap: the pipeline passed every gate (review, runtime, world-model,
  B7) yet shipped a dead/inaudible audio layer, because no agent rubric named audio — a
  subsystem is unverified unless a rubric asserts it. Now `code_agent` must expose
  `window.audioTest(scenario, seed?, opts?)` + `window.AUDIO_SPEC`, `audio_agent` must
  specify a small-speaker-audible bed (no sub-150 Hz-only bed), and `puppeteer_agent` runs
  an **advisory** Phase 2b audio check (never false-fails a valid game; a miss is
  `[AUDIO][advisory]`, never a bugfix-triggering severity).
- Added `scripts/audio-check/` control fixtures (`dead-bed.html`, `good-bed.html`) that
  prove the check is not vacuously green (verified: dead misses its floor, good passes).
- Documented the principle in `PROCESS.md` §4.6, citing the Torre Nosferatu run.

## 2026-10-10 — Torre Nosferatu audio fix (audibility + Music bus)

- Fixed the game being effectively silent: the ambient bed was inaudible on
  laptop/phone speakers (a 38 Hz-only drone sat below their reproduction floor,
  and fire/wind were ~30 dB down), leaving only the menu-click noise as audible
  "static". The drone is re-voiced with audible harmonics up to ~304 Hz and the
  bed levels are lifted; the mix is centralized in one table (`MIX`).
- The Music toggle now works: the drone, fire, wind, a new dread-tier melodic
  layer, and Orlok's theme play on the Music bus, while discrete cues stay on
  the SFX bus — each toggle silences only its own bus. Menu clicks are softened
  from a noisy burst to a quiet tick.
- Fixed a latent bug where all audio stayed muted after a death and retry: the
  master gain was cut on death and never restored. It is now reset on every
  new run.
- Creature cues are panned by direction, and Orlok's theme plays when the flame
  gutters. Added a deterministic offline audio check (`window.audioTest`) that
  asserts per-scenario levels, and documented the new mix targets in
  `audio_direction.txt`.

## 2026-10-10 — Torre Nosferatu pipeline run (submission game)

- Ran the full GAMEOTRON pipeline for the jam submission **Torre Nosferatu** (theme override;
  "full controls"). Mandatory approval gate fired: user selected concept **#14 "Dread Weather"**.
  All artifacts in `gameotron_output/20261010_095651/`.
- Phase outputs: `concepts.txt` (20) → `concepts_with_review.txt` → `selected_concept.txt`;
  `world_agent` → `world_template.json`/`.txt` + `world_map.json`/`.txt` (11 rooms, 17 directed
  exits, 5 NPCs, 6 creatures, Dread as lore `dread-dial`, `test_seed=20261010`); `gdd.md` (7
  screens, must-haves checklist); `audio_direction.txt` + `visual_direction.txt`; `code_agent` →
  `index.html`; `juice_agent` → 5 categories (2109 lines).
- **B7 gate: PASS** — tower-wide `systemState()` (non-null `dread` + 5 NPCs) at pristine boot,
  `social(id)` live, `required_encounters` reachable on `test_seed`, 5 wave-3 flags toggle without
  gating frozen hooks.
- **C5 end-to-end: PASS** — `check_template.mjs --fail-on spatial` → spatial 0, systemic 0, exit 0.
  Runtime: 51/51 checks across 1920×1080 / 800×600 / 375×667, 0 console errors.
- Review loop: 3 cycles; cycle-1 6 HIGH + 9 MEDIUM → cycle-2 1 HIGH (borrowed-door win shadowed) →
  cycle-3 clean. Buglists `buglist_102001/104132/105719.txt`, reports `test_report_*`, `phase2_report_*`.
- Docs: `COMPLIANCE.md` baseline + process/integrity boxes ticked; `ROADMAP.md` B7/C5 marked done;
  `PROCESS.md` extended with the Torre run + metric table.
- Repo hygiene: `build/` (the butler deploy output) is now gitignored; the deployed `index.html` is
  regenerated by `deployment_agent` from the run artifact, not tracked.

## 2026-10-10 — Torre pre-run reconciliation (§14 drift + B7 boot-state)

- `TORRE_NOSFERATU.md` §14: dropped the ad-hoc archetype enum (`exploration / combat / …`) in favour
  of a reference to the Holotron contract (`world_template.schema.json`); added a
  **state-vs-simulation** rule — `systemState()` reports the **tower-wide** survivor roster + Dread
  at all times (so B7 reads ≥1 NPC + Dread at the pristine Spire boot), while NPC simulation stays
  **active-floor-only** and the Spire stays encounter-free. No Holotron contract change.
- Reconciled `docs/plans/2026-10-10-torre-submission-execution-plan.md`: P0.1-P0.3 marked done;
  Phase 2 B7 check now asserts tower-wide `systemState()` at the pristine boot state; plan marked
  authoritative (npc-floors amendment incorporated).
- Added `docs/grill-me/2026-10-10-torre-plan-reground-stress-test.md` and
  `docs/plans/2026-10-10-torre-prerun-reconciliation-plan.md`.

## 2026-10-10 — Torre brief: proofread, expansions, required flag-gated wave-3, submission plan

- `TORRE_NOSFERATU.md` **proofread** (consistent **Dread** casing; parallel verbs) and **expanded**:
  §6.4 puzzles/traps/platforming now concrete; §7 creatures gained a depth/behaviour/cost table
  (Orlok excluded from the normal roster); §10 screens now a table with **Pause resume + back**
  restored; §11 visual (≤3-hue palette, radial falloff + spill ring, flame states, 1922 *Nosferatu*
  reference, 375 px silhouette rule); §12 audio (silence-as-tool, wax tick, Dread-rising drone,
  snuff-vs-guttering contrast). §2 theme framing corrected — the jam theme is open-ended.
- **Wave 3 is now required for the submission** and each sub-feature (NPC item use, creatures
  attacking NPCs, trap-tripping) ships **independently flag-gated** (graceful degradation, never a
  blanket cut) — recorded in `TORRE_NOSFERATU.md` §15 and the `gdd_agent` acceptance checklist.
- Added the submission-execution grill-me stress-test and plan under `docs/grill-me/` + `docs/plans/`.

## 2026-10-10 — Torre brief: five survivors & the descending tower

- `TORRE_NOSFERATU.md` now specifies a **descent** (wake at the **Spire**, escape the ground-floor
  exit) and **five recurring survivors** — Vlask the hoarder, Sister Marta the archivist, Ilona the
  bitten, Petr the innocent, Nadja the tomb-robber — as named **direction** (personalities + temptation
  poles), with the mechanics left to the GDD/template (§1, §6.3, new §6.5, §7, §8, §9, §14, §15).
- **Floor model (§6.5, §14):** floors generated from a **floor-agnostic** template; winding graph, not a
  stack; `down`/`up` stairs; each floor generated once from `hash(seed, depth)`, cached and mutated in
  place; survivors roam active-floor-only; per-floor escalation lives in the GDD. **No schema change.**
- **Win/loss (§8):** key is recoverable (dropped on death); an escaped survivor leaves the exit **ajar**
  for a window set by disposition + Dread (lesser ending + score penalty; raises Dread / draws creatures),
  with a fixed-count fallback if social is cut; **Orlok (wax-out) remains the sole death**; distinguished
  **snuff** from **guttering dark**. Fixed the Dread 4–5 clause so atonement is never wax-unaffordable.
- **Pipeline:** the brief now reaches the GDD — the orchestrator writes `direction.txt` and passes it to
  `gdd_agent`, which carries an **acceptance checklist** of the brief's must-haves; the approval gate's
  object is defined (the brief constrains, does not pre-select). `world_agent.md` notes the flat NPC
  roster + roaming + `required_encounters` pin; `code_agent.md` gains the multi-floor/`down`-`up`/
  pristine-boot-hook and roaming/ajar-door contract; `puppeteer_agent.md` checks the **pristine boot
  state** and the ≥1-NPC settlement; `world_template.schema.json` `x-runtime-state` documents the model.
  (`gameotron.md`, `AGENTS.md`, `gdd_agent.md`, `world_agent.md`, `code_agent.md`, `puppeteer_agent.md`.)
- Added the NPC/floor grill-me stress-test and the H2/M5 evaluation under `docs/` + `docs/plans/`.

## 2026-10-10 — Torre brief: the lore item (tradeable fragment)

- `TORRE_NOSFERATU.md` now defines **lore** as a collectible item: a discrete fragment that is
  non-survival (it never extends the candle), collected automatically on entering a room, and
  read in a free out-of-turn journal. Wave 1 it is flavor + score; wave 2 it becomes a reusable
  social key traded for disposition, information, or safe passage — **never wax or matches** —
  bounded by the per-NPC disposition cap (§5.1, plus §5, §6.3, §14, §15).
- Recorded the item's mutable contract: authored as a readable **thing** (`kind:"lore"`,
  `read_text` rendered as text, never HTML).
- Added a pre-registered, hand-counted falsifiability metric for both the flavor and trade layers
  (a single-file jam game has no telemetry, so thresholds are binary behavioral triggers, not rates).
- Added the lore grill-me stress-test and open-items research reports under `docs/grill-me/`.

## 2026-10-10 — C6 archetype role + count validation

- `scripts/check_template.mjs` now enforces each generated room's archetype: every room's `archetype` must name a declared archetype; the count of rooms per archetype must fall within the archetype's `count` bounds (unbounded archetypes skipped); and the `start` room's archetype must be the `role:entry` archetype. All are hard (`spatial`). Scope is **unexercised** (not failed) when no room declares an `archetype`, preserving the legacy controls' exit codes.
- Extended the state contract: `world_template.schema.json` gains `x-runtime-state` (canonical `worldState()` shape incl. `archetype`); `code_agent.md`, `gdd_agent.md`, and `AGENTS.md` updated. Active-floor scope documented.
- Fixtures: `golden_state.json` updated (two corridors + archetype tags); new `test_worlds/malformed_archetypes.json` (undeclared archetype + count violations) rejects with **3 spatial**. `malformed.json` (4 spatial) and `malformed_systems.json` (7 systemic, advisory) unchanged. `puppeteer_agent.md` control updated.
- Corrected the connectivity over-claim in `TORRE_NOSFERATU.md` §14 and `PROCESS.md` §4.5; filed connectivity validation as **C7** (needs the `*` grammar) and moved C6 ahead of C5 in `ROADMAP.md`.

## 2026-10-10 — Phase 2 checker wiring (puppeteer_agent)

- Wired the Phase 2 world-model check into `puppeteer_agent.md`: agent-driven extraction (pin `window.SEED = TEMPLATE.test_seed`, snapshot `worldState()`/`systemState()`, synthesize `socialLog` by driving warm+cold `window.social(id)`, write `state_<seed>.json`), then run the dependency-free checker. Fail-closed: missing hooks / unpopulated `socialLog` / null `test_seed` ⇒ **unverified**, never a vacuous pass.
- Added `--fail-on spatial|systemic|any` to `scripts/check_template.mjs` (default `any`) so rooms are **hard** and systemic **advisory** machine-readably, without parsing output text; guard mismatches always fail. Verified: golden ⇒ exit 0; `malformed.json` ⇒ 4 spatial (exit 1); `malformed_systems.json` ⇒ 7 systemic, advisory under `--fail-on spatial` (exit 0).
- Dropped the stale archetype role/`count` claim from the Phase 2 prose; filed archetype validation as **C6** in `ROADMAP.md`. Updated `AGENTS.md` (data-flow row + puppeteer gotcha) and `PROCESS.md` §4.5.

## 2026-10-10 — Phase 2 world-model checker + roadmap

- Added a deterministic, dependency-free Phase 2 validator (`scripts/check_template.mjs`) that checks the generated game's state against the world template: spatial checks (dangling exits, reachability, required things) and systemic checks (clock bounds + tier continuity, NPC count/disposition/bounds, social-action presence, and **observed** social-log direction + clamping, encounter/required-encounter presence).
- Added test fixtures: a conformant golden pair (`golden_template.json` + `golden_state.json` → 0 mismatches) and `malformed_systems.json` (→ 7 mismatches), alongside the existing spatial `malformed.json`. Dry-run confirmed the accept and reject paths before any pipeline wiring.
- Added `ROADMAP.md` tracking the remaining Torre run, the checker wiring, and the deliberately deferred Holonovel systems; cross-linked from `PROCESS.md`.

## 2026-10-10 — Systemic world-model deepening (Torre Nosferatu)

- Extended the Holonovel world template from spatial-only to the **full game loop**: `resources`, `clocks` (candle + the tug-of-war Dread dial with `tiers`/`effects`), `npcs`, `social_actions` (warm/cold), `encounter_roster`, `required_encounters`, and a pinned `test_seed`.
- Added `world_template.schema.json` as the documented contract (hand-enforced, no new dependency).
- `world_agent` now authors the social model (`manage_npc`/`manage_relationship`/`manage_lore`) and emits template v2; `code_agent` reads every system from `window.TEMPLATE`, embeds it via a `<script type="application/json">` block, and exposes same-handler `window.systemState()`/`window.social(id)` hooks; `gdd_agent` consumes template v2.
- Pinned the Holonovel dependency to commit `b6a182a`; `scripts/holonovel-mcp.sh` now fails loudly on drift (`HOLOTRON_HOLONOVEL_PIN` overrides).
- Spike finding (build `b6a182a`): deployed `manage_countdown` has no `clock_type` and cannot count up — Dread is authored as lore (`key: dread-dial`), not a clock; `clocks[].behavior` is our own contract field.
- Added `NOTICE`/`AUTHORS` attribution for the Holonovel (MIT) dependency.

## 2026-10-09 — Repo hygiene pass

- Added `CHANGELOG.md`, `AUTHORS`, `NOTICE`, `.editorconfig`, and a scoped `.gitattributes` (LF for shell scripts only).
- Filled in the PolyForm `Required Notice` line in `LICENSE.md`; fixed the broken README license link.
- Added an AGENTS.md rule to update `CHANGELOG.md` before commits.

## 2026-10-09
- Fork GAMEOTRON; add build plan, process/compliance docs, fork lineage.
- Phase 0 baseline — GAMEOTRON run + index.html + pipeline artifacts.
- Phase 1+2 — Holonovel world_agent integration, Rule Breaker Dungeon run, Linux deploy path.
- Document Phase 1+2 process (usability, config, world_agent, Linux deploy, metrics).
- Torre Nosferatu brief + re-scope plans (gamejam submission game).
- Switch world contract to template + seeded procgen.
- Clean up plans, grill-me reports, and fix .gitignore.
