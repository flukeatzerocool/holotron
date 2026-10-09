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

## Holotron Phase 2 — world-template consistency check (when the game exposes the world contract)
The Holotron fork adds a post-generation check that ties the game back to the world model
authored by `world_agent`. It runs after the standard runtime tests.
1. Pin a fixed seed: load `index.html` with a fixed `window.SEED` (URL parameter) so the
   generated layout is deterministic.
2. Read the generated world: call `window.worldState()` and compare it to `world_template.json`.
   **Constraint check** (not a 1:1 map compare):
   - every generated room's role is one of the template's archetypes, within `count` bounds;
   - every exit is a legal transition under the template's connectivity rules (no dangling exits);
   - every `required_things` entry is placed and reachable from `start`.
3. Drive real traversal: BFS the generated graph through real `window.move(dir)` calls and
   record observed vs. declared transitions (mismatch budget 0).
4. Report the mismatch count. **Fail-closed:** if `window.worldState` / `window.TEMPLATE` /
   `window.SEED` is absent, report the check as **unverified** — never pass.
5. Control: apply the same checker to a deliberately malformed world fixture
   (`test_worlds/malformed.json`) and require ≥2 mismatches, proving the checker detects
   errors rather than echoing the file.
Tooling fallback: Rule Breaker's run used the `playwright-cli` skill (Firefox headless) +
a local `python3 -m http.server`; use the same when Puppeteer/Chromium is unavailable.