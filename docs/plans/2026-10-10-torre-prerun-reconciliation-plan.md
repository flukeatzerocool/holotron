# Plan: Torre Nosferatu — pre-run reconciliation

Status: **Draft (pending plan-review)** · Date: 2026-10-10 · Goal owner: human
Source grill: `docs/grill-me/2026-10-10-torre-plan-reground-stress-test.md`
Amends: `docs/plans/2026-10-10-torre-submission-execution-plan.md` (authoritative run plan)

## Goal

Close the two live gaps the re-grounded grill found — the brief's §14 archetype-vocabulary drift
and the B7 boot-state collision — **before** the submission run, without touching the Holotron
contract (no Torre requirements in the framework).

## Scope

- **In:** `TORRE_NOSFERATU.md` (§14); `docs/plans/2026-10-10-torre-submission-execution-plan.md`
  (reconcile status + B7 wording).
- **Out:** `world_template.schema.json`; `code_agent.md`; Holonovel source; `opencode.json`;
  deployment path; re-opening the theme decision; re-opening no-fallback.

## Decisions locked

| Decision | Chosen | Rejected — why |
|---|---|---|
| Fallback | None ("Torre or bust") | Fallback game / Rule Breaker insurance — user: Torre is the submission; risk accepted |
| B7 at boot | `systemState()` reports **tower-wide state**; NPC **simulation** active-floor-only | Floor-scoped `systemState()` (fails B7 at the Spire); driving Phase 2 to floor 2 (extra harness) |
| §14 archetype list | Reference the contract; drop the enum | Aligning to the 7 ids (duplicates the schema); leaving as-is (drift misleads `world_agent`) |
| Where the state/sim rule lives | Brief §14 (Torre behaviour) | `code_agent.md` — would be a Torre requirement in Holotron |

## Part R0 — `TORRE_NOSFERATU.md` (§14; direction, not spec)

- **R0.1 [S]** §14 (`:344`): delete `exploration / combat / social / puzzle / treasure / exit`;
  state that room archetypes follow the Holotron contract (`world_template.schema.json`) and that
  `world_agent` authors the ids. No enum restated in the brief.
- **R0.2 [S]** §14: add one Torre-requirement line — the game's *state* (`systemState()`) reports
  the **tower-wide survivor roster + Dread at all times** (so B7 reads ≥1 NPC + dread at the
  pristine boot state), while NPC **simulation** is **active-floor-only** and the **Spire stays
  encounter-free** (beginner rule, §9). Worded as Torre behaviour, not framework vocabulary.

## Part R1 — reconcile the submission plan

- **R1.1 [S]** Mark `P0.1` **done** — the uncommitted work is committed at `3c9b98f`; `git status`
  clean. Prevent a no-op re-commit.
- **R1.2 [S]** Phase 2 (`:56-58`): add the B7 check that `systemState()` is **tower-wide at boot**
  (roster + dread), per R0.2; `worldState()` stays pristine-boot / active-floor.
- **R1.3 [S]** Note the submission plan is authoritative and the npc-floors amendment is
  incorporated (avoid two-plan overlap).

## Part R2 — gate & execute

- **R2.1 [S]** Run `plan-review` on this plan + the reconciled submission plan.
- **R2.2 [S]** Build mode → apply R0 + R1.
- **R2.3** Execute the submission plan's own sequence: P0 (remaining) → run → **B7** → **C5** →
  PROCESS → deploy/submit.

## Dependency order

R0 ‖ R1 → R2.1 → R2.2 → R2.3. R0 and R1 are independent; R2.3 consumes both.

## Verification

1. **R0** — `grep` `TORRE_NOSFERATU.md` §14: no `exploration / combat`; the state/sim line present.
2. **R1** — submission plan: `P0.1` marked done; Phase 2 names the tower-wide boot check.
3. **Run** — B7 passes: `systemState()` dread + ≥1 NPC at boot, `social(id)` live, encounter
   reachable on `test_seed`; `scripts/check_template.mjs --fail-on spatial` → 0 spatial.

## Rollback

All edits are prose/prose-adjacent under git — fully reversible (rollback cost **1**). No runtime,
data, or dependency state touched.

## Risks

- **[MED] Timeline residual.** No-fallback + required flag-gated wave 3, jam closes 2026-10-11
  12:00. Accepted; mitigation: start now, flag-gate wave-3 sub-features.
- **[MED] Encounter co-location vs checker.** Phase 2 drives `social(id)` directly, bypassing
  roaming co-location (npc-floors M2). Accepted: systemic is advisory.
- **[LOW] Brief still owns a "contract (settled)" header.** §14 stays a framework-section-in-a-brief;
  the R0 edit shrinks it toward a pointer but does not relocate it.

## Success criteria

- Brief §14 references the contract and carries the state-vs-simulation rule; no enum duplicated.
- Submission plan reconciled (P0.1 done; B7 tower-wide-at-boot check present) and plan-reviewed.
- B7 + C5 pass on the run; submission live before the deadline.
