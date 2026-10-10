# Stress-Test Report: audio-verification recommendations

- Verdict: READY
- Score: 84/100
- Questions asked: 9
- Dimensions covered: Premise, Feasibility, Edge Cases, Scope, Maintainability (Assumptions + Security/Risk assessed inline)
- Chosen approach: Minimal wedge (modified: audio_agent constraint retained, Rec3 deferred)

## Target

Four recommendations from the Torre Nosferatu build analysis:
1. Promote the audio probe into `puppeteer_agent`.
2. Validate `audio_direction`/`visual_direction` against physical reproduction constraints.
3. Make preconditions (P0.4) real or re-plan explicitly.
4. Treat the gap as a `PROCESS.md` case study.

## Blast Radius
- Files: `.opencode/agents/{code_agent,audio_agent,puppeteer_agent}.md`, `AGENTS.md`, `PROCESS.md`, two test fixtures.
- No runtime code, no dependencies, no data, no auth. Rollback cost 1 per file.

## Biggest Pushback
- Four recs share one root cause ("a subsystem is unverified unless a rubric names it").
  Resolved to Approach A: one mechanism (audio check) + one principle (PROCESS.md).
- Fixed audible floor (Q Edge) collided with the false-fail trip-point. Resolved:
  fixed **default** floor with a per-game declarable override, advisory severity, and
  escalation forbidden — a floor miss is a note, never a HIGH/MEDIUM.

## Decisions Locked
- [x] Shape: minimal wedge (Approach A).
- [x] Target: harden the reusable pipeline (agent-file edits), not a one-off.
- [x] Assertion: game-provided `window.audioTest()`, deterministic, named offline fallback.
- [x] Severity: advisory in `puppeteer_agent`, never blocks; escalation-forbidden.
- [x] Contract home: hook mandated in `code_agent.md` + `AGENTS.md`.
- [x] Non-WebAudio / silent games: N/A (skip), distinct from unverified.
- [x] Loudness: fixed default floor, overridable with a declared reason.
- [x] `audio_agent.md`: add small-speaker reproduction constraint.
- [x] Rec3 deferred; Rec4 = one PROCESS.md paragraph.
- [x] Control fixtures: known-dead vs known-good bed (anti-vacuity).

## High Severity
- (none)

## Medium Severity
- [x] Floor-vs-trip-point contradiction — resolved by default+override + escalation-forbidden.

## Low / Soft Flags
- [ ] The hook is self-declared: a game could declare a low override to mask a dead bed.
      Accepted — same trust model as `worldState()`/`systemState()`; the override must carry a reason string.
- [ ] Audibility still can't be proven headless; the check verifies the graph, not the ear.
- [ ] Advisory findings depend on a human reading the report — acceptable per the trip-point.

## Premise Check
- Do-nothing baseline: next run can ship a silent subsystem undetected (the exact Torre failure). Real.
- Falsifiability: abandon if the check false-fails a legitimate game. Mitigated by advisory severity + override.

## Unresolved
- (none)

## Recommended Next Step
- Draft the minimal-wedge plan, run `plan-review`, then execute in Build mode.

grill-me READY. audio-verification recommendations — 84/100, 0 unresolved high
