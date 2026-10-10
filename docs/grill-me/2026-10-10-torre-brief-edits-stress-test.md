# Stress-Test Report: TORRE_NOSFERATU.md recommended edits

- Verdict: **READY_WITH_RISKS**
- Score: **67/100**
- Questions asked: 7 (5 grill rounds + outside-voice integration)
- Dimensions covered: 7/7
- Chosen approach: **Modified path** — edit the brief in place (Approach A), paste the full
  brief at invocation, and reconcile the theme, archetype vocabulary, required encounters,
  hooks, and staging before the run.

## Blast Radius

- **Brief (1):** `TORRE_NOSFERATU.md` — run-command string, §2, §9, §14, §15.
- **Consumed by (indirect):** `ideation_agent` (theme), `world_agent` (archetypes /
  required_encounters), `code_agent` (hooks / staging), `gdd_agent` (numbers).
- **Gates affected:** B7 (ROADMAP.md:10-13) and its downstream C5.
- **Not touched:** Holonovel source, `opencode.json`, the checker, deployment path.

## Biggest Pushback

The recommended edits were sound but **did not move the B7 gate**, which is the whole point of
the run. The outside voice found the edits left a boot-time hook (`systemState()`) returning
systems the brief says do not exist on floor 1, and that the automated check cannot enforce the
"reachable on `test_seed`" criterion at all.

## Decisions Settled

- [x] Edits live **in place** in `TORRE_NOSFERATU.md` (Approach A); the full brief is pasted
  into the invocation prompt so it reaches every phase.
- [x] Theme override becomes
  `Anything Goes — Torre Nosferatu: escape a pitch-black candle-lit tower before Count Orlok takes your light`
  (live theme page verified this session: "The THEME is: Anything Goes").
- [x] Archetype vocabulary aligned to the schema's 7 role ids; `start` room role = `entry`;
  **contract-level only** (counts/numbers stay with `world_agent`/GDD).
- [x] `required_encounters` obligation added (≥1, floor 2, reachable on `test_seed`).
- [x] §14 names all four hooks: `worldState()`, `move(dir)`, `systemState()`, `social(id)`.
- [x] Wave 2 **un-cut**: NPCs + Dread + social actions ship in the core (B7 requires them).
- [x] `systemState()` is **tower-scoped** (roster + dread reported regardless of active floor);
  floor 1 stays gameplay-free of NPC encounters so the beginner rule holds.

## High Severity

- [x] **Resolved — floor-1 exclusion vs boot-time B7 sample.** §9 says social/Dread "never floor
  1" (TORRE_NOSFERATU.md:163); B7 samples `systemState()` at boot on `test_seed`. Fixed by
  making the hook tower-scoped.

## Medium Severity

- [ ] **M1 — `required_encounters` reachability is not enforced.** `check_template.mjs:203-205`
  only asserts the encounter id appears in `systemState().encounters`; the schema's
  `floor`/`reachable` fields (world_template.schema.json:52-64) are ignored. "Reachable on
  `test_seed`" can pass by echo. B7's stated guarantee is weaker than it reads.
- [ ] **M2 — Propagation of an 11 KB pasted brief is assumed, not designed.** `AGENTS.md`
  mandates explicit file-passing; the brief is in no agent's input list. If the orchestrator
  paraphrases or truncates, `required_encounters` (optional in the schema) and the social model
  may never be authored — B7 fails outside the edits' control.
- [ ] **M3 — Timeline safety valve removed.** Un-cutting wave 2 turns a cuttable feature into an
  all-or-nothing deliverable with the jam closing 2026-10-11 12:00 and no full Torre pipeline
  run yet. No fallback named.
- [ ] **M4 — Authenticity/preservation tension.** A prescriptive brief + a theme string naming
  the finished game ("Torre Nosferatu: escape…") risks making the mandatory approval gate a
  rubber stamp; `COMPLIANCE.md:8,30-31` requires the game be *generated through* GAMEOTRON with
  the gate preserved.

## Low Severity

- [ ] **L1 — Governance/single-source drift.** Naming hook names + role ids in the brief
  duplicates the contract that `world_template.schema.json:1-11` claims to own (prior grill M4).
- [ ] **L2 — Multi-floor entry semantics.** C6 asserts the start room's archetype is `entry`;
  the brief is multi-floor. Each floor's start room must be tagged `entry` or the check fails on
  floor 2+ — not stated anywhere.

## Unresolved

- [ ] M1 (reachability not enforced), M2 (propagation), M3 (timeline fallback), M4
  (authenticity). None are high; all are risks to acknowledge or mitigate in the plan.

## Well-Defended

- [x] Premise settled: in-place edit + paste-full-brief is coherent and gives the run a real payload.
- [x] Theme contradiction proven with live evidence, not opinion.
- [x] Contract-level (not counts) preserves the "direction, not spec" boundary.
- [x] Staging reconciliation (tower-scoped state) keeps the beginner rule intact while satisfying B7.

## Outside Voice Findings

Fresh-context reviewer, asked "what did this review miss?" Headlines: (1) §9 floor-1 exclusion
conflicts with the boot-time B7 hook; (2) `required_encounters` reachability is unenforced
(advisory, echo-satisfiable); (3) un-cutting wave 2 removes the deadline safety valve; (4) the
brief colonizes machine-contract vocabulary, deepening single-source drift; (5) authenticity
erosion of the approval gate; (6) how a pasted brief propagates to sub-agents is assumed, not
designed.

## Recommended Next Step

1. Apply the settled edits to `TORRE_NOSFERATU.md` (run string, §2, §9 note, §14, §15).
2. Decide M2 (make the orchestrator's file-passing explicit) and M3 (name the fallback).
3. Run `plan-review` on the edit plan, then Build mode to apply.
```
grill-me READY_WITH_RISKS. TORRE_NOSFERATU.md edits — 67/100, 0 unresolved high
```
