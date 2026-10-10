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
2. **Extract.** In-page, snapshot `window.worldState()` and `window.systemState()`. Normalize
   `clocks[...].value` defensively (`.value ?? .current ?? 0`). Write `state_<seed>.json`:
   `{ "world": <worldState>, "systems": <systemState> }`. Each room must carry its `archetype`
   id (the checker validates role + per-archetype `count` bounds); if **no** room declares an
   `archetype`, the archetype check is unexercised — not failed.
3. **Behavioral (synthesize `socialLog`).** The documented `systemState()` has no `socialLog`,
   but the checker reads one — so build it here: for ≥1 warm and ≥1 cold action in
   `template.social_actions`, read `systemState().clocks.dread.value` before, call
   `window.social(id)`, read it after, and append `{ id, dreadBefore, dreadAfter }` to
   `systems.socialLog`. If `social_actions` are declared but no log can be produced, the
   behavioral portion is **UNVERIFIED** — never a vacuous pass.
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