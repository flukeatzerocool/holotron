# Plan: Torre Nosferatu — conformance update (hazard→trap + always-visible Orlok) into the shipped game

Status: **Draft (pending plan-review)** · Date: 2026-10-11 · Goal owner: human (present at confirmations)
Source: `docs/grill-me/2026-10-11-torre-conformance-update-stress-test.md` (READY_WITH_RISKS, 83/100)
Predecessors (do not re-run): `2026-10-11-torre-hazard-to-trap-rename-stress-test.md` (tooling already migrated, `f82e549`).

## Goal

Bring the **game artifacts** into full conformance with the revised brief `TORRE_NOSFERATU.md`
(`f82e549`): the full delta **D1–D9**. Method: **hybrid** — `world_agent` re-authors the authored
template under the new schema, then `code_agent` **modifies the existing polished `index.html` in
place** (no regeneration). Ship via a **superseding re-push** gated on a full proof bar.

## Scope

- **In:** D1–D9; run folder + log; register/doc updates; build prep; confirmed re-push; rollback build.
- **Out:** ideation re-run (gate fired for concept #14; accepted as an update); schema/checker edits
  (already done in `f82e549`); Holonovel source; `opencode.json`; a new game concept.

## Delta (D1–D9)

| # | Item | Owner |
|---|------|-------|
| D1 | `hazard`→`trap`, cut `puzzle` (vocabulary + logic) | code_agent |
| D2 | 6-trap roster: add **snap trap** + **spider web**; drop crumbling-stair/dark-leap | code_agent |
| D3 | Companion adjacency (web trap ↔ Spiders room) | world_agent + code_agent |
| D4 | Always-visible Orlok at mask edge | code_agent |
| D5 | Lore info reward = floor/stair layout hint | code_agent |
| D6 | NPCs visible within candle radius | code_agent |
| D7 | Trap escalation by density/region, shared creature+trap budget | code_agent |
| D8 | Re-author `world_template.json`/`.txt` under new schema | world_agent |
| D9 | `gdd.md` / `visual_direction.txt` / `audio_direction.txt` aligned | doc edits |

## Decisions locked (from the grill)

| Decision | Chosen |
|---|---|
| Conformance scope | Full D1–D9 |
| Method | Hybrid: world_agent → code_agent **modify-in-place** |
| index.html owner | code_agent modify-in-place (D2/D4 exceed bugfix_agent's contract) |
| Parity order | world_agent first → patch + embed exact JSON |
| Approval gate | Skipping ideation acceptable as an update (record rationale) |
| Proof bar (gates push) | TEMPLATE message-equal to `world_template.json` **AND** `check_template.mjs --fail-on spatial` exit 0 **AND** puppeteer Phase 2 pass **AND** review 0 CRIT/0 HIGH; autoplay + Phase 2b audio **advisory** |
| Key placement | Trap-free lore/treasure room; Spire key in refill room |
| Rollback | Preserve live build + exact push command before re-push |
| Modify-in-place guard | Snapshot + unified diff + line budget reviewed by review_agent |
| Post-window supersession | Acceptable |

## Phase 0 — Pin, snapshot, rollback (preconditions)

- **P0.1 [S]** Confirm `git status --short` clean; record HEAD (`f82e549`).
- **P0.2 [S]** Create run folder `YYYYMMDD_HHMMSS/` + `<ts>.log` (new file, never append); write the
  revised brief to `<ts>/direction.txt`.
- **P0.3 [S] — Rollback artifact.** Identify the **currently live** build (probe the itch.io project
  page / confirm with the user which build is submitted), copy it to `<ts>/rollback/index.live.html`,
  and record the exact `butler push` target + command. If the live build cannot be identified, use
  `build/index.html` (== `20261011_004054`, sha1 `caae08e5…`) and record that assumption.
- **P0.4 [S]** Snapshot the base `index.html` to `<ts>/index.pre-update.html` for the diff budget.
- **P0.5 [S] — world_agent precondition (assumption check).** Confirm the Holonovel MCP is reachable
  and pinned (`scripts/holonovel-mcp.sh`, commit `b6a182a`) before P1.1; a failure here aborts P1.

## Phase 1 — world_agent re-authors the template (D8)

- **P1.1 [L]** Run `world_agent` with: revised brief, `world_template.schema.json` (new enums),
  and the selected concept from the prior run. Produces `world_template.json` + `world_template.txt`:
  `kind:"trap"`, `role:"trap"`, 6 traps incl. `companion:"spiders"` on the web trap, **no** `puzzle`;
  Dread `clocks[]` `tug_of_war` (0–8, tiers); ≥1 NPC; non-null `test_seed`; `required_encounters`
  with `reachable:true`.
- **P1.2 [S] — Template acceptance (gate before P2).** Confirm the authored **template** declares:
  non-null `test_seed`; the web trap carries `companion:"spiders"`; no `hazard`/`puzzle` enums remain;
  ≥1 NPC; Dread clock with tiers; `required_encounters` non-empty with `reachable:true`. (Companion
  adjacency and room placement are **state** properties — they are asserted in P4, not here.) A miss
  ⇒ re-run `world_agent` (not a code fix).
- **P1.3 [S] — Error-gate dry run (fixtures).** `check_template.mjs` requires **both** `--template`
  and `--state` (verified: `scripts/check_template.mjs:34`), so there is no template-only mode.
  Dry-run it against its **own paired fixtures** — `test_worlds/trap_template.json` +
  `trap_pass_state.json` → exit 0; `trap_fail_state.json`, `companion_fail_state.json` → exit 1;
  `golden_template.json`+`golden_state.json` unchanged — to confirm the checker behaves, and
  **record every finding before promising green**. (Do not pair the new authored template with an
  unrelated fixture state — that yields false findings; the new template is validated against the
  game state in P4.)

## Phase 2 — code_agent modifies the build in place (D1–D7, D9-game)

- **P2.1 [S]** Copy `build/index.html` → `<ts>/index.html` (working copy; source run untouched).
- **P2.2 [L]** Run `code_agent` **instructed to modify `<ts>/index.html` in place** (not regenerate):
  embed `world_template.json` **verbatim** as `window.TEMPLATE`; rename `hazard`→`trap` and cut
  `puzzle` across generator + logic (index.html:308,315,454–459,679–696,1620,2098); add **snap trap**
  + **spider web** with the generator asserting companion adjacency; **always-visible Orlok**; lore
  floor/stair hint; NPC-in-light rendering; trap density escalation; key → trap-free lore/treasure
  room (Spire refill).
- **P2.3 [S] — Modify-in-place guard.** `code_agent` emits a unified diff. **Budget (pinned):**
  reject as a wholesale rewrite if the diff changes **>35% of `index.html` lines**, or if it removes
  any existing screen id or any required hook (`worldState`, `systemState`, `move`, `social`).
  `review_agent` confirms the diff is additive/localized within budget; **reject and re-invoke**
  otherwise.
- **P2.4 [S]** `node --check` the file; headless smoke (0 console errors).

## Phase 3 — Parity gate (hard)

- **P3.1 [S]** Assert the embedded `window.TEMPLATE` is **message-equal** (JSON-normalized) to
  `world_template.json`. Mismatch ⇒ back to P2.2.

## Phase 4 — Review loop (hard gate, ≤3 cycles)

- **P4.1 [M]** Reconcile the puppeteer Phase 2 expectations against the current build's hooks
  (`worldState()`, `systemState()`, `move(dir)`, `social(id)`, `window.SEED`) before the loop — the
  build passed Phase 2 pre-update (`004054` log), so a missing hook is a regression from P2, not a
  checker change.
- **P4.2 [M]** `review_agent` (static) ∥ `puppeteer_agent` (3 viewports + **Phase 2 world-model check**
  via `worldState()`/`systemState()` on `test_seed` ∥ **Phase 2b audio** advisory). The Phase 2 run
  **is** the template↔game spatial check (companion adjacency + no-required-thing-in-trap-room).
- **P4.3 [M]** If CRITICAL/HIGH (or MEDIUM) remain and cycles < 3 → `bugfix_agent` → repeat.
  Stop at 0 CRIT/0 HIGH, or 3 cycles with open MEDIUMs recorded.

## Phase 5 — Advisory regression (recorded, non-blocking)

- **P5.1 [S]** `scripts/autoplay` greedy run (≥80% target) recorded for the new trap systems.
- **P5.2 [S]** Record Phase-2b audio result.

## Phase 6 — Registers & docs (D9 + provenance)

- **P6.1 [M]** Align `gdd.md`, `visual_direction.txt`, `audio_direction.txt` to the trap/Orlok changes.
- **P6.2 [S]** Update `CHANGELOG.md` (per `changelog-before-commit`), `PROCESS.md` (the update +
  **off-contract code_agent modify-in-place usage** + the approval-gate-update rationale),
  `COMPLIANCE.md`. Grep `ROADMAP.md` (and any register) for cross-references to the retired
  `hazard`/`puzzle` items or the update, and update every hit in the same step.

## Phase 7 — Build prep + confirmed re-push

- **P7.1 [M]** Copy the verified `<ts>/index.html` → `build/index.html`; `deployment_agent` prepares
  (`description.txt`, `tags.txt`); `butler status` auth check.
- **P7.2 [M]** `butler push` **only after explicit confirmation** in-session; then confirm the page
  resolves live. On a regressed build: re-push `rollback/index.live.html` (P0.3).

## Dependency order

P0 → P1 (P1.2 gates P2) → P3 → P4 → P5 → P6 → P7. P2 depends on P1's JSON; P3 on P2; P4 on P3;
P7 last. P5 independent of P6. P0.3/P0.4 independent.

## Verification

| Step | Check |
|---|---|
| P1.2 | template declares: test_seed non-null; web trap `companion:"spiders"`; no hazard/puzzle enums; ≥1 NPC; Dread tiers; required_encounters reachable:true |
| P1.3 | checker dry-run vs `test_worlds/` fixtures recorded (none promised away) |
| P2.3 | unified diff within line budget; no wholesale rewrite |
| P2.4 | `node --check` OK; 0 console errors |
| P3.1 | `window.TEMPLATE` message-equal to `world_template.json` |
| P4 | review 0 CRIT/0 HIGH; puppeteer Phase 2 pass (spatial 0; companion adjacency); runtime 0 errors |
| P5 | autoplay % + audio result recorded (advisory) |
| P7 | `butler status`; page resolves live |

## Rollback

- Docs/registers: git revert — cost **1**.
- Generated artifacts (run folder): regenerate or discard — cost **1**.
- Re-push: not reversible in-repo — cost **2**; mitigated by P0.3 rollback build + P3/P4 proof bar.

## Risks & mitigations

- **[MED] Seed re-baseline first try.** world_agent's `test_seed` must satisfy companion adjacency +
  placement with the patched generator. Mitigation: P1.2 template gate + P4 spatial check + one
  regeneration cycle allowed.
- **[MED] Modify-in-place drift.** Assumption that code_agent holds the patch. Mitigation: P2.3 guard.
- **[MED] Parity silent drift.** Mitigation: P3.1 message-equality gate.
- **[LOW] `build/` is git-tracked.** Decide track vs. ignore in P6.2; note the `butler-log.txt` §7 flag.
- **[LOW] Unmeasurable falsifier.** Always-visible-Orlok legibility test stays pre-registered only.

## Success criteria

- `world_template.json`/`.txt` and `<ts>/index.html` conform to the revised brief (D1–D9).
- P3.1 parity holds; P4 review 0 CRIT/0 HIGH; puppeteer Phase 2 pass.
- `build/index.html` updated from the verified artifact; docs/registers updated.
- Re-push completed after confirmation; live page verified; rollback build preserved.
