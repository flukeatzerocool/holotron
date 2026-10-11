# Stress-Test Report: Torre Nosferatu — automated playtest & the 5 playtest fixes

- Verdict: READY_WITH_RISKS
- Score: 86/100
- Questions asked: 7
- Dimensions covered: 7/7
- Chosen approach: Modified minimal path (visibility-first + optimal/greedy band + two-arm A/B)
- Date: 2026-10-11
- Target: the user's plan to "automatically playtest the game to gather user data, then use that data to improve the GDD", on top of five playtest complaints.

## Blast Radius

- Files: `gameotron_output/20261010_095651/{gdd.md, world_template.json, world_template.txt, index.html, world_map.json, world_map.txt}`, new `scripts/autoplay/*`, register updates (`PROCESS.md`, `ROADMAP.md`, `CHANGELOG.md`), `visual_direction.txt` (radius contract).
- Data stores: none (single-file, offline client game).
- Customers: the jam submission (itch.io) and the user as playtester.
- Systems: wax economy, reveal-radius curve, key/descent gate, Run/Endure/match economy, encounter roster (drop `locked-door`).

## Biggest Pushback

A bot is not a user. The proposed autoplay harness can only answer **1 of the 5 complaints** (#5 wax). #2 (multiple keys) and #4 (Run/Endure dominated) are statically provable; #1 (unclear door rules) and #3 ("forcing doors") are comprehension failures a bot cannot observe. Scope was reduced to match.

## Resolved Design Decisions (ratified during the grill)

1. Harness = minimal, hook-reusing, **wax-only**; committed source, agent-invoked; no general framework.
2. Policies = **optimal + frontier-greedy (no map memory)**; judge by the greedy floor, not the optimal ceiling.
3. Success bar = **greedy ≥80% completion of 50 runs, ≥15% median wax surplus at exit**.
4. **Visibility-first**: treat the collapsing radius tail as the prime suspect before adding fuel. `radiusPenalty` (index.html:762) returns −2 at wax 12–17, −3 at 6–11, −4 at 1–5, so the back half of a 30-wax run is radius 1–2.
5. **Design #1–#4 first**, then measure/tune #5 on the revised game.
6. **Two-arm A/B** (−radius-fix vs +radius-fix) to attribute the result and catch over-correction.
7. Key placement = **puzzle/lore room** (floors 2–6); **Spire exempted** → treasure room (default, see Medium).

## High Severity

- (none)

## Medium Severity

- [ ] **Unresolved — Spire key placement.** The puzzle-room rule conflicts with the Spire tutorial: the generator places `scribe-alcove` on every floor and `puzzleFor(1)` falls through to `list[0]` = `locked-door` (index.html:648-649), so the Spire puzzle room currently hosts a puzzle encounter. Placing the key there may force a puzzle/snuff on the beginner floor, breaking "first success <30s". Default: Spire key in the treasure/refill room; floors 2–6 in the puzzle/lore room. Ratify or override.
- [ ] Key-in-puzzle adds exploration turns + a possible puzzle snuff, which worsens #5. Mitigated by the two-arm A/B measurement.

## Low Severity

- [ ] No committed browser dependency; harness is agent-invoked. Document the `playwright-cli` + Firefox preflight.
- [ ] Radius-floor change alters the visual contract ("radius tied to wax", `visual_direction.txt`) — update it alongside.

## Unresolved

- [ ] Spire key placement (Medium #1).

## Well-Defined (defended)

- [x] Harness scope, policy definition, and success bar all pinned with numbers.
- [x] Root cause interrogated (visibility vs quantity), not assumed.
- [x] Ordering risk (design-first loses the before-baseline) recovered via A/B.
- [x] Bot home decided (committed source, agent-invoked) and portable-by-convention.

## Evidence Used

- `index.html:640,1273` — every `descending-stair` carries `exit-key`; `G.key` is a single boolean (complaint #2).
- `index.html:1510-1521` — Endure = Run + snuff; strictly dominated (complaint #4).
- `index.html:1505` — "Force it and burn wax" copy; only source of "forcing doors" (complaint #3).
- `index.html:762-781` — `radiusPenalty`; radius collapses to 1–2 for wax ≤17.
- `phase2_report_110910.txt:101-105` — instrumented natural playthrough reached the ground-floor stair on turn 40 (wax not tight for an efficient player).
- `AGENTS.md` — "browser work is agent-driven (repo forbids npm/puppeteer deps)".
- `world_template.schema.json` / `scripts/check_template.mjs` — `required_things` reachability is already validated.

## Recommended Next Step

Revise the plan to the modified path above, then run `plan-review` on the revised plan before any implementation. Do not build yet.
