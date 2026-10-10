# Stress-Test Report: Next roadmap item — C5 premise vs C6 archetype validation

- Verdict: **READY_WITH_RISKS**
- Score: **84/100**
- Questions asked: 8 (7 scored dimensions + falsifiability close)
- Dimensions covered: 7/7
- Chosen approach: **Modified path** — reject C5-as-next; do **C6** (archetype role + count
  validation) first, as a contract change, then C5 once the Torre gate clears.

## Blast Radius

- **Agents (2):** `code_agent.md` (state contract gains `archetype`), `puppeteer_agent.md`
  (Phase 2 invocation unchanged; new fixture in the control step).
- **Checker (1):** `scripts/check_template.mjs` (new archetype/count logic, classified
  `spatial`).
- **Contract/doc (4+):** `world_template.schema.json` (canonical state description),
  `gdd_agent.md`, `AGENTS.md` data-flow, `PROCESS.md` §4.5, `TORRE_NOSFERATU.md` §14
  (connectivity claim correction).
- **Fixtures (4):** `golden_state.json` (add archetypes, satisfy corridor `[2,4]`),
  `malformed.json` (re-baseline expected count), new `malformed_archetypes.json`,
  `golden_template.json` (unchanged).
- **Roadmap (1):** `ROADMAP.md` (reorder C6 before C5; file connectivity as C7).
- **Not touched:** Holonovel source, `opencode.json`, deployment path.

## Biggest Pushback

**C5 is not the next item — it is blocked and it does not check what the docs claim.**
C5 sits behind the B→B7 gate (ROADMAP.md:8-21) and no Torre artifacts exist
(`gameotron_output/` holds only the two Rule Breaker runs). Independently, the checker did
**not** validate archetypes/connectivity, so C5's "spatial = 0" would over-claim against
`TORRE_NOSFERATU.md:208-210`. The unblocked roadmap item is C6. The user accepted doing C6
first.

## Decisions Settled

- [x] Do **C6** before C5; the premise that C5 is next was rejected.
- [x] C6 is a **contract change**: each `worldState()` room gains `archetype` (archetype id).
- [x] Archetype/count mismatches are **`spatial` (hard)**; unbounded archetypes (no `count`)
  are skipped.
- [x] C6 scope = **role + count only**; connectivity deferred to a new **C7** and the §14
  claim corrected.
- [x] **Active-floor** scope: `worldState()` reports one floor; counts are validated per floor.
- [x] Verification: new `malformed_archetypes.json` (≥2 spatial) + updated golden (0); assert
  `start` room role == `entry`; re-baseline `malformed.json`.
- [x] One **canonical** source for the state contract (schema doc), others reference it.
- [x] Success/stop test agreed: success = reject fixture ≥2 spatial (exit 1) AND updated
  golden ⇒ 0 (exit 0), no new dependency; **stop** if the check can't be fixture-exercised
  or forces generation-algorithm changes.

## High Severity

- [ ] **H2 — `worldState()` has no archetype field.** Checker cannot map rooms to archetypes
  (`code_agent.md:40`; `golden_state.json`). *Resolved by decision:* extend the contract.

## Medium Severity

- [ ] **M1 — Doc over-claim remains until edited.** `TORRE_NOSFERATU.md:208-210` + `PROCESS.md`
  say connectivity/archetypes are validated; today neither is. Must correct when C6 lands.
- [ ] **M2 — Roadmap ordering.** C5 is listed before the unblocked C6; reorder and mark C5's
  gate explicitly.
- [ ] **M3 — Fixture breakage.** `golden_state.json` currently has 1 corridor vs template
  `[2,4]`; it will fail once counts bind. `malformed.json` gains "unknown archetype" noise
  across rooms. Both need re-baselining.
- [ ] **M4 — Multi-floor conflation.** Torre is multi-floor; flat `worldState()` risks summing
  cross-floor rooms. Scoped to active-floor, but the contract text must say so.

## Low Severity

- [ ] **L1 — Optional `count`.** Schema requires only `id`,`role`; unbounded archetypes must be
  skipped, not crash the checker.
- [ ] **L2 — `*` semantics undefined.** Connectivity rules use `a -> b*` with no grammar;
  blocks any future connectivity check (now C7’s prerequisite).

## Unresolved

- [ ] C5 remains blocked on B/B7 (unchanged by this grill) — medium.

## Well-Defended

- [x] Gate severity: hard for rooms, advisory for systemic — deliberately protects the
  deadline (`puppeteer_agent.md:48-49`).
- [x] Non-tautological check via same-handler hooks (`code_agent.md:39`) — prior grill H3
  partially closed.
- [x] Fixture-based soundness (accept + reject) — directly addresses prior grill M1.
- [x] Scope discipline: connectivity explicitly deferred rather than guessed.

## Recommended Next Step

1. Edit `TORRE_NOSFERATU.md` §14 + `PROCESS.md` §4.5 to drop the connectivity claim.
2. Define C6 in `ROADMAP.md` with the settled decisions; file C7 (connectivity) with the `*`
   grammar as its first task; reorder C5 after C6.
3. Implement C6: contract (`code_agent.md` + canonical schema description) → checker →
   fixtures → baseline.
4. Then run `plan-review` on the C6 plan before Build.

## Output Contract

```
grill-me READY_WITH_RISKS. roadmap next-item (C6 archetype validation) — 84/100, 0 unresolved high
```
