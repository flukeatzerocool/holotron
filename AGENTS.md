# AGENTS.md

## Repo purpose

OpenCode agent workspace for Gameotron game jam. No source code — only agent `.md` files in `.opencode/agents/`. Each run produces a single-file `index.html` browser game deployed to itch.io via Butler.

## Architecture

```
.opencode/agents/
├── gameotron.md      ← Orchestrator (primary, outputs to timestamped/)
├── theme_agent.md          ← Theme discovery (gameotron.whiterabbitfactory.com)
├── ideation_agent.md       ← Concept generation
├── browsergame_expert.md   ← Expert concept review (@-mentionable)
├── evaluation_agent.md     ← Concept scoring and ranking
├── world_agent.md          ← World-template authoring/validation via the Holonovel MCP (Design phase)
├── gdd_agent.md            ← Game Design Document
├── audio_agent.md          ← Audio direction
├── visual_agent.md         ← Visual direction
├── code_agent.md           ← Game implementation (single HTML file)
├── review_agent.md         ← Static code analysis
├── puppeteer_agent.md      ← Runtime testing (headless browser)
├── bugfix_agent.md         ← Bug fixing (surgical changes)
├── juice_agent.md          ← Game feel & polish (particles, screenshake, hit-stop, transitions)
├── deployment_agent.md     ← itch.io upload via Butler
```

- **`opencode.json`** — added by the Holotron fork to mount the Holonovel world-model MCP server (scoped to `world_agent`); agents are still invoked by name by the orchestrator. The launcher `scripts/holonovel-mcp.sh` pins the Holonovel commit (`b6a182a`) and fails loudly on drift.
- **No npm/node/bun** — `.opencode/.gitignore` blocks `node_modules`, `package.json`, `package-lock.json`, `bun.lock`
- **`trijam_gamedev.md` is a legacy orchestrator.** Use `gameotron.md` (primary). Individual `.opencode/agents/*.md` files are authoritative.

## Usage

```
Use gameotron
Use gameotron with theme: Space Potato
Use gameotron with full controls
Use gameotron with theme: Cyber Pumpkin with full controls
Create game with theme: One Way Ticket
```

## Pipeline order (never deviate)

| Phase | Tasks | Notes |
|-------|-------|-------|
| 1. Discovery | `theme_agent` | Get Gameotron theme (or use theme override) |
| 2. Ideation | `ideation_agent` → `browsergame_expert` review → **user approval** → `evaluation_agent` | Expert scores HOOK/TOUCH/THEME (1-5); evaluation uses weighted scoring (HOOK 30%, TOUCH 25%, THEME 45%) |
| 3. Design | `world_agent` → `gdd_agent` | World **and social** template authored/validated via Holonovel (`world_template.json`/`world_template.txt`, per `world_template.schema.json`), then Game Design Document |
| 4. Concept Art | `audio_agent` + `visual_agent` | **Parallel execution** |
| 5. Implementation & Review Loop | `code_agent` → [`review_agent` + `puppeteer_agent` → `bugfix_agent`] × N | Max 3 cycles; stop when no CRITICAL/HIGH/MEDIUM remain |
| 5.5 Polish | `juice_agent` | Particles, screenshake, hit-stop, transitions, popups — surgical additions only |
| 6. Deployment | `deployment_agent` | Butler upload; user confirms first |

Execute **one agent at a time** (exception: audio + visual run in parallel). Never skip the user approval gate after concept review.

## Game requirements

- Single `index.html` — all HTML, CSS, JS embedded, vanilla JS only
- Touch + mouse **both required**: `touchstart/touchmove/touchend` + `mousedown/mousemove/mouseup`
- `<meta name="viewport">` required; canvas scales to viewport; touch targets finger-sized
- Optional keyboard: WASD + arrow keys + Space (only when "full controls" or "keyboard support" explicitly requested)

## Bug severity levels

| Severity | Definition | Example |
|----------|------------|---------|
| CRITICAL | Game-breaking, crashes, unplayable | Infinite loops, state corruption, missing gameplay |
| HIGH | Features broken, incorrect logic | Wrong physics, missing required features, race conditions |
| MEDIUM | Visual glitches, minor UX issues | Animation bugs, toast freeze |
| LOW | Code style, optimization | Unused variables, magic numbers, typos |

## Retry policy

| Agent | Retries | On exhaustion |
|-------|---------|---------------|
| theme_agent | 2 | Ask user for theme override |
| ideation_agent | 1 | Abort pipeline |
| evaluation_agent | 1 | Abort pipeline |
| gdd_agent | 0 | Abort immediately |
| code_agent | 0 | Abort immediately |
| review_agent | 1 | Abort pipeline |
| puppeteer_agent | 1 | Skip testing |
| bugfix_agent | 1 | Proceed with warnings |
| juice_agent | 1 | Skip juice pass, proceed to deployment |
| deployment_agent | 2 | Skip upload |

## Theme discovery

1. Fetch `http://gameotron.whiterabbitfactory.com/theme.html` → parse theme after "The THEME is:" until linebreak, trimmed
2. **Validation (critical):** fetch up to 3 times; all parses must be non-empty and identical. On failure/inconsistency after retries → ask user for theme override

### Theme override

Syntax: `"with theme: X"`, `"theme: X"`, or `"Create game with theme: X"`. Skips theme_agent, passes theme directly to ideation_agent.

## GDD requirements (per gdd_agent.md)

- Screen Inventory: **6+ screens** — Title (logo, Start, How to Play), Pause Menu (music toggle, SFX toggle, How to Play, back, resume), How to Play, Gameplay, Settings (music/SFX, Reset, Credits), Game Over/Victory
- Difficulty: beginner-friendly entry, linear curve, first success within 30s, Near-Miss Bonus (+50 pts), Zone-Bonus

## Data flow

Agents don't share state — orchestrator must explicitly pass file contents between phases.

| Agent | Produces | Consumes |
|-------|----------|----------|
| theme_agent | `theme.txt` | — |
| ideation_agent | `concepts.txt` | `theme.txt` |
| browsergame_expert | `concepts_with_review.txt` | `concepts.txt` |
| evaluation_agent | `selected_concept.txt` | `concepts.txt` + `concepts_with_review.txt` |
| world_agent | `world_template.json`, `world_template.txt` (per `world_template.schema.json`; + `world_map.json`, `world_map.txt` exemplar) | `selected_concept.txt` + `concepts_with_review.txt` + `world_template.schema.json` |
| gdd_agent | `gdd.md` | `selected_concept.txt` + `concepts.txt` + `concepts_with_review.txt` + `world_template.json`/`world_template.txt` |
| audio_agent | `audio_direction.txt` | `gdd.md` |
| visual_agent | `visual_direction.txt` | `gdd.md` |
| code_agent | `index.html` | `gdd.md` + `audio_direction.txt` + `visual_direction.txt` + `world_template.json` (embed as `window.TEMPLATE` via a `<script type="application/json">` block; seed from `window.SEED`, honoring `test_seed`; expose `window.worldState()`, `window.systemState()`, `window.move(dir)`, `window.social(id)`) |
| review_agent | `buglist_HHmmss.txt` | `index.html` |
| puppeteer_agent | `runtime_errors_HHmmss.txt`, `test_report_HHmmss.txt`, `phase2_report_HHmmss.txt` | `index.html` (+ `testcases.txt` if exists) + `world_template.json` (Phase 2) |
| bugfix_agent | fixed `index.html` + appended buglist | `index.html` + `buglist_HHmmss.txt` |
| juice_agent | enhanced `index.html` + `juice_report.txt` | `index.html` + `gdd.md` + `visual_direction.txt` + `audio_direction.txt` |
| deployment_agent | `build/index.html`, `description.txt`, `tags.txt`, `butler-log.txt` | `index.html` |

## Agent-specific gotchas

- **theme_agent:** Must validate jam theme fetch. Source is gameotron.whiterabbitfactory.com, NOT itch.io directly
- **ideation_agent:** Output section specifies 20 concepts numbered 1-20 (consistent with orchestrator spec).
- **gdd_agent:** Screen Inventory must include 6+ screens with Pause Menu containing music/SFX toggles and How To Play button
- **world_agent:** Runs at Design before gdd_agent. Calls `set_badge(game_master)` → `manage_novel(create)` → `manage_world(convert)` (rooms) → `create_exit`/`create_thing` → `manage_npc`/`manage_relationship`/`manage_lore`; reads back `world://map`, `npcs://`, `lore://active`; emits `world_template.json` (per `world_template.schema.json`: archetypes + connectivity + required things/encounters + resources + clocks + NPCs + social actions + encounter roster) + `world_template.txt`, and the concrete `world_map.json`/`world_map.txt` exemplar. **Dread is authored as lore** (`key: dread-dial`), not a clock — the pinned `manage_countdown` has no `clock_type` and cannot count up (spike 2026-10-10, build `b6a182a`). One `convert` per fresh Novel (re-convert ⇒ `STATE_CONFLICT`). `generate` is forbidden (content-absent ruleset-free, REQ-431).
- **code_agent:** Embeds `world_template.json` as `window.TEMPLATE` via a `<script type="application/json">` data block (safe: authored strings may contain `</script>`), generates levels **and systems** from it seeded by `window.SEED` (honoring `test_seed`), and exposes `window.worldState()`, `window.systemState()`, `window.move(dir)`, `window.social(id)` — each a thin wrapper over the same handler the UI uses — for the Phase 2 check. Do not use `window.WORLD`.
- **review_agent:** Checks GDD compliance, game feel features (particles, screenshake, hit-stop), and all screens from Screen Inventory
- **puppeteer_agent:** Tests at exactly 3 viewports (1920×1080, 800×600, 375×667) — touch events on mobile, mouse on desktop. **Phase 2 world-model check** (after runtime tests): browser work is agent-driven (repo forbids npm/puppeteer deps) — pin `window.SEED = TEMPLATE.test_seed`, export `worldState()`/`systemState()` to `state_<seed>.json`, synthesize `socialLog` by driving warm+cold `window.social(id)`, then run the dependency-free `scripts/check_template.mjs --fail-on spatial` (rooms **hard**, systemic **advisory**). Fail-closed: missing hooks / no `socialLog` / null `test_seed` ⇒ **unverified**, never pass.
- **bugfix_agent:** Must append fix summary to existing buglist, never rewrite `index.html` wholesale. Make minimal surgical changes.
- **juice_agent:** Must not break working code — additives only. Max 5 juice categories per run to avoid bloat. All juice must be togglable via `juiceEnabled` flag. Runs after bugfix loop is clean, before deployment.
- **deployment_agent:** Butler at `.\butler-windows-amd64\butler.exe`, target `username/project:html5`, API key from `$env:BUTLER_API_KEY`. Check auth with `butler status` before upload. User must confirm deployment before Butler runs.
- **Credentials (any agent):** itch.io credentials must come from `$ITCH_USERNAME` / `$ITCH_PASSWORD` (or `$BUTLER_API_KEY`) environment variables. Never hardcode credentials or store them in repository files.

## Phase 5 — Review/bugfix loop (detail)

After `code_agent` creates `index.html`:
1. `review_agent` AND `puppeteer_agent` run **simultaneously** (parallel)
   - review_agent: scans code → `buglist_HHmmss.txt`
   - puppeteer_agent: headless browser → `runtime_errors_HHmmss.txt`, `test_report_HHmmss.txt`
2. **IF** `[CRITICAL]`, `[HIGH]`, or `[MEDIUM]` found in EITHER file AND cycles < 3:
   - Pass combined buglist to `bugfix_agent`
   - `bugfix_agent` fixes bugs, appends `FIXED BUGS:` section to buglist
   - Return to step 1 for verification
3. **IF** only `[LOW]` or clean OR 3 cycles done → proceed to Phase 5.5 (juice_agent)

### Critical testing principle
**Never just check if state changed — always verify actual interaction mechanics worked:**
- Click coordinates calculated correctly for current viewport
- Button hit detection actually fired (not just screen changed)
- Works across all viewport sizes (desktop 1920×1080, desktop-small 800×600, mobile 375×667)

## Deployment

- Butler CLI: `.\butler-windows-amd64\butler.exe` (override with `$BUTLER_PATH`)
- API key: `$env:BUTLER_API_KEY`
- Target: `username/project:html5`
- Upload command: `& ".\butler-windows-amd64\butler.exe" push build/ username/project:html5`
- Check auth with `butler status` before upload
- User must confirm deployment before Butler runs

## Logging

- Create folder at run start: `YYYYMMDD_HHMMSS/`
- Log file: `YYYYMMDD_HHMMSS.log` in that folder — new file each run (never append)
- Log every operation with `[HHmmss]` timestamps: phase transitions, agent execution, decisions, data passing, token usage, errors, game-specific results (theme, scores, review cycle, juice status, deployment result)

## Changelog

- Update `CHANGELOG.md` before committing any semantic change, per the `changelog-before-commit` skill (date-stamped/bulleted format).

## Common mistakes

1. **Missing data passing:** Orchestrator must explicitly pass outputs between dependent tasks
2. **PowerShell `&&`:** Not supported — use `; cmd1; if ($?) { cmd2 }` for chaining
3. **Wrong output paths:** Folder and logfile use `YYYYMMDD_HHMMSS`; buglists use `HHmmss` suffix only
