# Stress-Test Report: Torre Nosferatu — propagate brief revision (hazard→trap + always-visible Orlok) into the shipped game

- Verdict: READY_WITH_RISKS
- Score: 83/100
- Questions asked: 11
- Dimensions covered: 7/7
- Chosen approach: Modified path — hybrid conformance update (world_agent re-authors the authored template → code_agent modifies the existing polished `index.html` in place), superseding re-push with a full proof bar.
- Date: 2026-10-11

## Blast Radius

- Files: `build/index.html`, `20261011_004054/index.html` (embedded `window.TEMPLATE` + generator/encounter logic), `world_template.json`/`.txt` (authored), `gdd.md`, `visual_direction.txt`, `audio_direction.txt`, `description.txt`, `tags.txt`, `world_template.schema.json` (already migrated), `scripts/check_template.mjs`, `scripts/autoplay/*`, `CHANGELOG.md`, `PROCESS.md`, `COMPLIANCE.md`, `docs/`.
- Data stores: none (single-file, offline client).
- Customers: the itch.io jam entry (game page) and the user as playtester. Process/provenance half unaffected.
- Systems: tower-template contract, encounter roster (traps), reveal-radius/Orlok render, wax economy, key placement, lore reward, NPC visibility.

## Biggest Pushback

The proposed method was framed as "run the pipeline to update from the brief" vs. "a new build." Pre-scan showed the two collapse: `code_agent` regenerates `index.html` wholesale, so a "pipeline update" *is* a new build. The repo's own `CHANGELOG.md` (§f82e549) already asserted the intended path — *"the next `world_agent`/`code_agent` run emits `kind:"trap"`/`role:"trap"`. No `index.html` hand-edit"* — which contradicts both the earlier surgical suggestion and a full regeneration. The resolution that surfaced: **the delta is partly a template-contract change (world_agent) and partly an in-place game patch (code_agent)**, i.e. a hybrid — not either pole.

## Resolved Decisions (ratified during the grill)

1. **Goal:** full brief conformance — the full set **D1–D9** (not a subset).
2. **Method:** **hybrid** — `world_agent` re-authors `world_template.json`/`.txt` under the new schema; `code_agent` **modifies the existing `index.html` in place** (no full regeneration).
3. **index.html owner:** `code_agent` modify-in-place (feature-scale D2/D4 exceed `bugfix_agent`'s "minimal change" contract).
4. **Parity order:** `world_agent` first → then patch + embed that exact JSON as `window.TEMPLATE`; verify parity before review.
5. **Approval gate:** skipping ideation for this update is **acceptable** — the gate fired for concept #14 in the original run (`COMPLIANCE.md:30-32`); this is an update, not a new concept. Record the rationale.
6. **Proof bar (gates re-push):** embedded `TEMPLATE` **message-equal** to `world_template.json` **AND** `check_template.mjs --fail-on spatial` exit 0 **AND** puppeteer Phase 2 pass **AND** `review_agent` 0 CRITICAL / 0 HIGH. **Advisory (recorded, non-blocking):** Phase 2b audio, autoplay ≥80% greedy.
7. **Key placement after puzzles cut:** trap-free lore/treasure room; Spire key in the refill room (restores the Plan-v2 rule).
8. **Rollback:** preserve the current live build + the exact butler push command before re-pushing.
9. **Modify-in-place guard:** snapshot `index.html`; require a unified diff; `review_agent` verifies the diff is localized within a set line budget; reject and re-invoke otherwise.
10. **Post-window supersession:** acceptable — a later itch.io project update still is the entry.

## High Severity

- (none)

## Medium Severity

- [ ] **Seed re-baseline on first try.** `world_agent`'s fresh `test_seed` must satisfy companion-adjacency + no-required-thing-in-trap-room with the patched generator, or Phase 2 fails. Mitigation: land D3 generator logic before verification; expect one regeneration cycle.
- [ ] **Modify-in-place drift.** `code_agent` "in-place" is off-contract (`AGENTS.md`); a de-facto rewrite discards the polish. Mitigation: diff review + line budget (decision 9).
- [ ] **Unmeasurable falsifier.** The always-visible-Orlok legibility test (`TORRE_NOSFERATU.md:295-298`) is hand-counted and cannot be run in-window; it remains pre-registered only.

## Low Severity

- [ ] `build/` is git-tracked despite the "gitignored per convention" note (`butler-log.txt` §7); updating it changes a tracked artifact — decide track vs. ignore.
- [ ] Patrol `PROCESS.md`/`COMPLIANCE.md`/`CHANGELOG.md` for the update and the off-contract code_agent usage.

## Unresolved

- [ ] None blocking. Medium items above are mitigations, not open decisions.

## Well-Defended

- [x] Method ambiguity resolved (hybrid, not either pole) with sequencing pinned.
- [x] Parity drift attackable: an explicit message-equality gate, not silent.
- [x] Rollback path for an irreversible-but-superseding push.
- [x] Puzzle-cutout key-placement re-decided from repo evidence (`004054` log, autoplay grill Medium #1).

## Recommended Next Step

1. Revise the plan to the decisions above.
2. Run `plan-review` on the revised plan before any implementation.
3. Build via `world_agent` → `code_agent`(modify-in-place) → verify (parity + spatial + Phase 2 + review) → deploy-prep → confirmed re-push.

## Verdict

`grill-me READY_WITH_RISKS. Torre conformance update — 83/100, 0 unresolved high`
