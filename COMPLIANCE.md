# COMPLIANCE — Gameotron Game Jam valid entry

Source: https://itch.io/jam/gameotrongamejam (window: Oct 9 2026 10:00 → Oct 11 2026 12:00).

**Submission game:** **Torre Nosferatu** — see `TORRE_NOSFERATU.md`. (#7 "Rule Breaker Dungeon" is the Holonovel integration proof/baseline, already deployed.)

A valid entry demonstrates **both**:
1. A playable browser game generated through GAMEOTRON.
2. A documented process showing how GAMEOTRON was used, configured, or improved.

## Baseline requirements (generated game)

- [x] Vanilla JavaScript only — no frameworks or external libraries
- [x] HTML, CSS, JS in a single `index.html` (2109 lines, `gameotron_output/20261010_095651/index.html`)
- [x] Mouse and touch support (verified at 1920×1080, 800×600, 375×667)
- [x] Responsive canvas, mobile-friendly layout
- [x] Finger-sized touch targets, viewport-aware (≥48 px)
- [x] Optional keyboard (WASD, arrow keys, Space) — enabled this run ("full controls")
- [x] ≥6 screens: Title, Pause, How to Play, Gameplay, Settings, Game Over/Victory (7 shipped)
- [x] Pause + settings music and sound-effect options

## Process / sharing

### Documented process (summary)

How GAMEOTRON was **used, configured, and improved** to produce the submission game **Torre
Nosferatu** (dev-facing depth: `PROCESS.md`; dated change list: `CHANGELOG.md`).

- **Used:** theme override `Torre Nosferatu — escape a pitch-black candle-lit tower…` + full
  controls. Ideation ran and the mandatory approval gate fired (user selected concept **#14
  "Dread Weather"**); the brief `TORRE_NOSFERATU.md` reached `gdd_agent` as `direction.txt` (a
  constraint, not a spec). Full pipeline ran: `world_agent` → `gdd_agent` → audio ∥ visual →
  `code_agent` → review loop → `juice_agent`.
- **Configured:** `opencode.json` mounts the Holonovel world-model MCP, scoped to a new
  `world_agent`; `scripts/holonovel-mcp.sh` is hermetic and pinned to commit `b6a182a`; the
  default run ends at Phase 5.5 with deployment **opt-in**.
- **Improved:** the world is authored and `convert`-validated before code (11 rooms / 17 directed
  exits / 5 NPCs); a dependency-free Phase-2 world↔game checker (rooms hard, systemic advisory)
  with control fixtures that prove it catches injected errors; an advisory Phase-2b audio check
  that closed the "silent game passed every gate" gap.
- **Updated:** after the post-playtest revision, the brief's `f82e549` revision (hazard→trap, puzzles
  cut, 6-trap roster + companion events, always-visible Orlok) was propagated to the **shipped game**
  by a hybrid run — `world_agent` re-authored the template, `code_agent` modified the polished
  `index.html` in place (run `20261011_095532/`). No ideation re-run (gate fired for #14; an update,
  not a new concept).
- **Before/after metric:** world structures validated before `code_agent` — **none → 11 rooms /
  17 directed exits**; game↔world mismatches on `test_seed` — **unmeasured → 0 spatial, 0
  systemic**; console errors across 3 viewports — **0** (51/51 checks).

- [x] `PROCESS.md` documents use/configuration/improvement in depth; this summary + `CHANGELOG.md`
      carry the judged process half
- [x] Public documented fork ("share improvements on GitHub")
- [x] Pipeline artifacts published: GDD, visual/audio direction, review/runtime/test/juice reports, process logs, game source (`gameotron_output/20261010_095651/`)
- [x] License preserved: PolyForm Noncommercial 1.0.0 + `Required Notice:` lines

## Workflow integrity

- [x] Mandatory ideation approval gate preserved (fired; user selected #14 "Dread Weather")
- [x] GAMEOTRON phase order preserved (orchestrator edited additively only)

## Submission

- [ ] itch.io project created; jam joined
- [ ] HTML5 build uploaded (single `index.html` / zip with `index.html` at root)
- [ ] Submitted before Oct 11 2026 12:00
