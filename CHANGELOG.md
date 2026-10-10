# Changelog

All notable changes to Holotron are documented here.
Format: date-stamped sections, bulleted entries.

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
