# Stress-Test Report: Torre Nosferatu run readiness

- Verdict: **READY_WITH_RISKS**
- Score: **81/100**
- Questions asked: 9 (+1 push-back)
- Dimensions covered: 7/7
- Chosen approach: **Approach B (Torre-only, wave 3 required, flag-gated) — no freeze time**

> Complements the prior reports (`…submission-execution-stress-test.md`,
> `…plan-reground-stress-test.md`), which settled the framework/brief reconciliation. This
> report settles the **run-execution decisions** (scope, gates, definitions of done).

## Blast Radius

- **Run:** the full GAMEOTRON pipeline, `gameotron_output/<ts>/`.
- **Artifacts:** `world_template.json`, `gdd.md`, `index.html`, review/runtime/Phase-2 reports.
- **Docs:** `PROCESS.md` (extend), `ROADMAP.md` + `CHANGELOG.md` (update), `COMPLIANCE.md` checklist.
- **External:** new itch.io project for Torre (game half), public page + jam entry.
- **Not touched:** Holotron contract (`schema`, agents), Holonovel source, `opencode.json`, deploy scripts.

## Decisions settled

- [x] **Scope: Approach B, no freeze — "Torre or bust".** Wave 1–3 required; no fallback build.
      Accepted risk (sovereign); residual is explicit below.
- [x] **Approval gate is real.** Ideation runs fresh on the theme; brief *constrains* the concept
      space but does not pre-select. A selection/override is recorded transparently in `PROCESS.md`.
- [x] **P0.4 is a run precondition.** User creates the new itch.io project + joins the jam *before*
      Phase 1. Unautomated, user-only.
- [x] **Wave-3 flags gate behaviour only.** Graceful degradation: flags off = NPCs don't use items /
      aren't attacked / don't trip traps; the core loop is unaffected.
- [x] **Testable hooks are frozen.** Flags may **never** gate `social(id)`, the required encounter,
      or NPC/Dread state — otherwise a flag off forces the fail-closed checker to "unverified",
      which by the hard B7 rule would be a no-submit. Behaviour is flaggable; hooks are not.
- [x] **Design-phase acceptance check.** After Design, inspect that `world_template.json` carries a
      **non-null `test_seed`** and a **`required_encounters` entry reachable on it**. A miss is a
      no-submit (unverified), so it is checked immediately, not discovered at Phase 2.
- [x] **B7 and C5 are hard submission gates.** Failure = no submission (consistent with no-freeze).
      C5 policy remains rooms-hard / systemic-advisory.
- [x] **Review-loop exhaustion bar.** After 3 cycles, ship as-is with open MEDIUMs recorded in the
      buglist.
- [x] **Definition of done (submission).** Notable push-back: "push is enough" was rejected against
      `PROCESS.md:88-89` (400 without verified email; Private page doesn't resolve). Final: butler
      push **succeeds** AND the **page resolves live** AND the **jam entry is in**; pre-flight =
      verified email + Public project.

## High Severity

- [ ] **H1 — No freeze × hard B7/C5 × required wave 3, never-run pipeline, ~26h.** The three
      choices compound: any spurious "unverified" (null `test_seed`, unreachable required encounter,
      missing hook, empty `socialLog`) becomes a no-submit. **Mitigations now in place:** hooks
      frozen (so flags can't cause it); Design-phase `test_seed`/encounter acceptance check; start
      immediately; user present at the gate. **Residual accepted:** still no fallback artifact.

## Medium Severity

- [ ] **M1 — Timeline.** Full run on a never-executed pipeline; no freeze. Accepted.
- [ ] **M2 — Encounter trigger vs checker.** Phase 2 drives `social(id)` directly, bypassing roaming
      co-location. Accepted: systemic advisory.
- [ ] **M3 — Per-floor escalation untested** (prose-only). Accepted: systemic advisory.
- [ ] **M4 — `PROCESS.md` documents the wrong game until extended.** Mitigation: hard pre-submit step.
- [ ] **M5 — New project is separate from the live `holotron` page.** Track both halves explicitly in
      `PROCESS.md` (game page vs pipeline page).

## Low Severity

- [ ] **L1 — Plan overlap.** Keep `2026-10-10-torre-submission-execution-plan.md` authoritative;
      reference the amendment plan.

## Well-Defended

- [x] Gate authenticity: brief constrains, does not pre-select; override recorded.
- [x] Flag-gating with frozen hooks — resolves the degradation × hard-gate collision.
- [x] DoD grounded in recorded itch.io gotchas, not optimism.
- [x] No framework change for Torre's needs.

## Recommended Next Step

- Freeze the run plan (incorporate the decisions above), `plan-review` it, then Build → run.

```
grill-me READY_WITH_RISKS. Torre Nosferatu run readiness — 81/100, 0 unresolved high
```
