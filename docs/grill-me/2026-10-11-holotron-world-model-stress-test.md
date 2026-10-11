# Stress-Test Report: Holotron world-model integration (R1–R7)

- Verdict: READY_WITH_RISKS
- Score: 85/100
- Questions asked: 10
- Dimensions covered: 6/6
- Chosen approach: Modified path — A (minimal wedge) with the "one real gap" itself demoted

## Blast Radius
- Pipeline docs: `.opencode/agents/world_agent.md`, `gdd_agent.md` (connectivity wording)
- Backlog: `ROADMAP.md` (deferred R2/R4/R5/R6/R7 with triggers)
- NOT touched: `world_template.schema.json`, `scripts/check_template.mjs`, `code_agent.md`, `test_worlds/`, all prior-run artifacts
- No code, no checker, no gate, no schema change survives

## Biggest Pushback
- The original R1–R7 was solution-seeking: it "fixed" a pipeline that shipped a
  checker-clean game with a passing B7 gate. Scrutiny collapsed it to near-zero.
- R1's premise was false: the exemplar is self-validated (run log:10), and
  "make it load-bearing" would have reversed the deliberate 2026-10-10 procgen decision.
- The surviving "one real gap" (assert generated floors obey `connectivity.rules`) was
  built on a decorative rule: `genFloor()` never reads `connectivity.rules`
  (`index.html:327,469`; gdd_agent.md:10 "declared, not yet validated"), and the authored
  exemplar violates it (`world_map.txt:21-32` — treasure->treasure, exit->puzzle,
  puzzle->exit, hazard->exit).
- The rename target was the ephemeral per-run Novel; every shipped artifact already
  says `floor-key` (`world_map.txt:13,42`, `world_template.json:338`).

## High Severity
- [x] RESOLVED — "assert connectivity" rested on a non-normative, self-violated rule.
      Resolution: demote `connectivity.rules` to documentation; do not assert.

## Medium Severity
- [ ] UNRESOLVED — No concrete failure motivates any change; motivation is preventive.
      Accepted by the user, but it means the plan earns its keep only as a backlog.

## Low Severity
- [x] Anti-smuggling rule ("no TORRE-specific fixes in the pipeline") is discipline-only,
      with no mechanical guard. Accepted risk.
- [x] Rename dropped: cosmetically touches only the disposable Novel.

## Unresolved
- [ ] R2/R4/R5/R6/R7 deferred with no trigger attached *yet* — must be logged in
      ROADMAP.md or "later" becomes "never".

## Well-Defended
- [x] R1 dropped; procgen retained; exemplar stays diagnostic.
- [x] Connectivity demoted rather than asserted.
- [x] New assertions, if ever added, are grandfathered / unexercised no-op.
- [x] Falsifiable trigger named: "a game ships an undetected world-model mismatch."

## Decided Outcome
1. Document `connectivity.rules` as non-normative (world_agent.md / gdd_agent.md wording).
2. Log R2/R4/R5/R6/R7 in ROADMAP.md, each tagged with its falsifiable revisit trigger.
3. Drop R1 and the rename. No schema/checker/code change.

## Recommended Next Step
- Apply the two documentation/backlog edits (a Minimal Change; no plan gate needed),
  then re-run nothing structural. Revisit R4 (systemic hard gate) only when the named
  trigger fires.
- Optional: outside-voice review for what this grill missed.
```
