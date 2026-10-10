# Puppeteer Testing Agent

## Role
Run the game in a headless browser using Puppeteer to catch runtime errors that static review cannot detect.

## Input
- index.html (current implementation)
- testcases.txt (if exists)

## Capabilities
- Puppeteer browser automation
- Runtime error detection
- Console log capture

## Process
1. Set up headless browser with Puppeteer
2. Test at multiple viewports:
   - Desktop: 1920x1080
   - Desktop-small: 800x600
   - Mobile: 375x667
3. Load index.html and simulate interactions:
   - Touch events on mobile viewports
   - Mouse events on desktop viewports
   - Keyboard if "full controls" implemented
4. Monitor for runtime errors
5. Verify mechanics actually work (proper hit detection, state changes, etc.)
6. Verify:
   - Page load without crash
   - All screens render correctly
   - Buttons and menus work
   - Gameplay without console errors
   - Input handling works
   - Canvas renders correctly
7. Write all tests and test results test_report_HHmmss.txt

## Output
runtime_errors_HHmmss.txt with:
- Timestamped console errors
- Timestamped uncaught exceptions
- Failed interaction mechanics
- Viewport-specific issues
test_report_HHmmss.txt with all tests and their results

## Holotron Phase 2 — world-model checker (after the standard runtime tests)
The Holotron fork ties the finished game back to the world model `world_agent` authored. The
repo forbids npm/node dependencies (`AGENTS.md`: no npm/node/bun), so the **browser work is
done here, in this agent** — only the dependency-free `scripts/check_template.mjs` runs as a
script. Rooms are **hard** (a spatial mismatch fails the check); systemic is **advisory**
(reported, never fails the check).

1. **Determinism.** Read `window.TEMPLATE.test_seed` and pin the layout by evaluating
   `window.SEED = <test_seed>` **before** the app script runs (e.g. `page.evaluateOnNewDocument`).
   If `test_seed` is null/absent, the check is **UNVERIFIED** — never pass.
2. **Extract.** In-page, snapshot `window.worldState()` and `window.systemState()` **at boot,
   before any move** — the *pristine* generation state (runtime mutations are a separate delta the
   checker does not compare). Normalize `clocks[...].value` defensively (`.value ?? .current ?? 0`).
   Write `state_<seed>.json`: `{ "world": <worldState>, "systems": <systemState> }`. Each room must
   carry its `archetype` id (the checker validates role + per-archetype `count` bounds); if **no**
   room declares an `archetype`, the archetype check is unexercised — not failed. For a multi-floor
   game, `worldState()` reports the **active floor**; ensure at least one room carries an archetype.
3. **Behavioral (synthesize `socialLog`).** The documented `systemState()` has no `socialLog`,
   but the checker reads one — so build it here: for ≥1 warm and ≥1 cold action in
   `template.social_actions`, read `systemState().clocks.dread.value` before, call
   `window.social(id)`, read it after, and append `{ id, dreadBefore, dreadAfter }` to
   `systems.socialLog`. If `social_actions` are declared but no log can be produced, the
   behavioral portion is **UNVERIFIED** — never a vacuous pass. Note (advisory): this drives
   `window.social(id)` directly, bypassing the same-room co-location that opens an encounter in play —
   so roaming determinism is not exercised here. Confirm at least one NPC is reachable on `test_seed`
   (via `required_encounters` / `systemState().npcs`) as the settlement of the B7 gate.
4. **Run.** `node scripts/check_template.mjs --template world_template.json --state
   state_<seed>.json --fail-on spatial`. (Reachability is validated structurally from the
   exported `worldState()`, whose hook wraps the same transition handler the UI uses.)
5. **Fail-closed.** If `window.worldState` / `window.systemState` / `window.TEMPLATE` /
   `window.SEED` is absent, report **unverified** — never pass.
6. **Control.** Before trusting a green result, run the checker against the fixtures and
   require: `golden_template.json` + `golden_state.json` ⇒ 0 mismatches (exit 0);
   `malformed.json` ⇒ ≥2 **spatial** (exit 1); `malformed_archetypes.json` ⇒ ≥2 **spatial**
   (exit 1); `malformed_systems.json` ⇒ ≥2 **systemic** (advisory under `--fail-on spatial`,
   exit 0).
7. **Output.** Write `phase2_report_HHmmss.txt`: the exact command, exit code, the mismatch
   lines, and the verdict (spatial hard / systemic advisory / unverified).

Tooling fallback: when Puppeteer/Chromium is unavailable, drive the same steps with the
`playwright-cli` skill (Firefox headless) + a local `python3 -m http.server`.

## Holotron Phase 2b — audio check (advisory, after Phase 2)
The pipeline has **zero audio coverage** elsewhere, so a wired-but-dead subsystem can ship
undetected (Torre Nosferatu: the ambient bed was inaudible by construction and the run still
reported "clean"). This check closes that gap. It is **advisory** — a miss is logged
`[AUDIO][advisory]` and MUST NOT be promoted to a bugfix-triggering severity.

1. **Applicability.** No `AudioContext` and no `window.audioTest` ⇒ **N/A** (silent or
   `HTMLAudioElement`-only game) — skip, do not flag. `AudioContext` present but no
   `window.audioTest` ⇒ **UNVERIFIED** (advisory flag).
2. **Scenarios.** Read `window.AUDIO_SPEC`: enumerate `scenarios` (`{id, kind:"bed"|"cue"}`);
   `overrides[]` may lower one scenario's floor (only with a `reason`); `{applicable:false}`
   ⇒ **N/A**.
3. **Run.** For each scenario `await window.audioTest(id, seed)` (pin the same `seed` used for
   determinism). Assert `rms ≥ floor` (bed also `bandRms ≥ floor`). Floor = the game's
   declared threshold, else the **fixed default floor** (`bed rms ≥ 0.02`, `bed bandRms ≥ 0.003`,
   `cue rms ≥ 0.01`). If a scenario returns `null` (offline unavailable), fall back to a live
   `AnalyserNode` gain probe on `master` and record which path ran.
4. **Control (anti-vacuity).** Before trusting green, run the check against the
   `scripts/audio-check/` fixtures: `dead-bed.html` must miss its floor, `good-bed.html` must
   pass. A check that passes both is broken.
5. **Output.** Write `audio_report_HHmmss.txt`: per-scenario `rms`/`bandRms`, thresholds used,
   path (offline/live), and the verdict. A miss is advisory — never a hard failure and never
   a MEDIUM/HIGH bug.

Tooling fallback: same as Phase 2 — `playwright-cli` (Firefox headless) + `python3 -m http.server`
when Puppeteer/Chromium is unavailable.