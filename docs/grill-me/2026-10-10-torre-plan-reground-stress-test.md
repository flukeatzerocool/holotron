# Stress-Test Report: Torre submission plan (re-grounded)

- Verdict: **READY_WITH_RISKS**
- Score: **74/100**
- Questions asked: 3 (post-regrounding) + outside-voice integration
- Dimensions covered: 7/7
- Chosen approach: **Modified path** — reconcile the brief's §14 with the contract, state the
  state-vs-simulation split, then execute the existing submission plan.

> Supersedes the stale findings in `2026-10-10-torre-brief-edits-stress-test.md` (written against
> the 228-line brief; the repo has since advanced to `3c9b98f`, brief = 404 lines, two plans).

## Blast Radius

- **Brief (1):** `TORRE_NOSFERATU.md` §14 (archetype list; state/simulation note).
- **Plans (2):** `2026-10-10-torre-submission-execution-plan.md` (Draft; stale P0.1),
  `2026-10-10-torre-npc-floors-amendment-plan.md` (Approved) — reconcile, don't duplicate.
- **Gates:** B7 and downstream C5.
- **Not touched:** Holotron contract (`schema`, `code_agent.md`), Holonovel source,
  `opencode.json`, deployment path.

## Reconstruction — what changed under the session

HEAD moved from `2962c61` to `3c9b98f` (three commits). The brief gained the descent (§6.5),
five survivors (§6.3), a tradeable lore item (§5.1), wave-1/2/3 staging (§15), and a Handoff
(§16). Two plans now exist. Earlier recommendations were therefore re-scored: theme (kept as the
brief's string — defensible, jam theme is open-ended), `required_encounters` (handled in
`world_agent.md`), hooks (handled via the pristine-boot hook), staging (superseded by wave 1/2/3).

## Decisions Settled

- [x] **No-fallback** ("Torre or bust", no fallback game) — defended; risk explicit and accepted.
- [x] **B7 at boot is satisfiable in-game:** `systemState()` reports the **tower roster + Dread
  globally**; NPC **simulation** stays **active-floor-only**. No Holotron contract change.
- [x] **§14 archetype list:** drop the ad-hoc enum; **reference the contract** instead of
  restating the schema's role ids (closes the brief→framework drift).

## High Severity

- [x] **Resolved — B7 boot vs Spire-no-social.** Phase 2 asserts ≥1 NPC at pristine boot, but boot
  is the Spire (no social per §9) with active-floor-only sim. Resolved by the state/simulation
  split above (a game-internal convention; no framework edit).

## Medium Severity

- [ ] **M1 — Timeline residual.** No-fallback + required flag-gated wave 3 on a never-run pipeline,
  closing 2026-10-11 12:00. Accepted; mitigation is flag-gating + starting now.
- [ ] **M2 — Encounter trigger vs checker.** Phase 2 drives `social(id)` directly, bypassing
  roaming co-location (npc-floors M2). Accepted: systemic is advisory.
- [ ] **M3 — Plan staleness.** Submission plan P0.1 ("commit uncommitted work") is already done;
  the plan must be updated before use or it will re-run a no-op.

## Low Severity

- [ ] **L1 — Plan overlap.** Two plans with overlapping scope/statuses; keep one authoritative
  (submission-execution) and reference the other.
- [ ] **L2 — §14 header.** "World-model contract (settled)" inside the brief remains a
  framework-section-in-a-brief; the §14 edit should shrink it toward a pointer.

## Well-Defended

- [x] Theme kept as the brief's string — the jam theme is deliberately open-ended (§2), so
  self-selection is coherent.
- [x] Staged delivery with flag-gated wave-3 sub-features (graceful degradation, no blanket cut).
- [x] No framework change for Torre's needs — honors the "no Torre-in-Holotron" rule.

## Outside Voice Findings

Already incorporated during the prior round: the boot-vs-Spire collision and the
`required_encounters` reachability gap were surfaced by the fresh-context reviewer; the former is
now resolved, the latter remains advisory by design.

## Recommended Next Step

1. Apply the two brief edits (§14 list → contract reference; state/sim note).
2. Reconcile the submission plan (mark P0.1 done; add the B7 tower-wide-state check).
3. `plan-review` the reconciled submission plan, then Build → run.
```
grill-me READY_WITH_RISKS. Torre submission plan (re-grounded) — 74/100, 0 unresolved high
```
