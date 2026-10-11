# Plan: Codify jam-requirement interpretations as pipeline instructions

- Date: 2026-10-10
- Shape: Planned Change (multi-file instruction edit)
- Status: draft (awaiting user approval)

## Goal

Make the pipeline's behavior match the user's (corrected) reading of the Gameotron
jam requirements, durably, in the agent instructions:

1. Theme — official theme may be "Anything Goes"; a theme override is sanctioned.
   A theme value is still recorded and seeds ideation. (Phase 1 kept.)
2. Concepts — the 20 reviewed concepts are a pool to **choose from or adapt**;
   the approval gate remains mandatory.
3. No auto-upload — the default run **hard-stops after Phase 5.5** and hands the
   playable `index.html` back for playtest. Deployment is a separate,
   explicitly-requested run.

Success criteria: after the edits, `AGENTS.md` and `.opencode/agents/gameotron.md`
agree, no instruction says "prepare and deploy" as a default, and the deployment
push is gated behind an explicit second confirmation.

## Settled decisions (from grill-me)

- Keep Phase 1 (fetch "Anything Goes" or honor override). Rejected: skip Phase 1
  entirely (contradicts "transform the official jam theme").
- Keep the mandatory approval gate; allow adaptation of concepts. Rejected: drop
  the gate (documented as mandatory in both jam sources).
- Deployment becomes opt-in; default pipeline terminates at Phase 5.5.

## Canonical source of truth

`AGENTS.md` is the architecture/description; `.opencode/agents/gameotron.md` is the
executable orchestrator. Both encode the pipeline and must be edited **in the same
change** (resolves the grill's "two-file drift" medium).

**Widened drift set (plan-review §2 register coupling).** Other docs also encode the
pipeline and drift the moment the default terminus changes. Enumerated by a repo-wide
drift sweep (see Verification V0):
- `README.md` (workflow + Phase 6) — standing template doc → edit (C6).
- `PROCESS.md` — standing: §6 Reproduction step 6 is forward-looking; §4 is the
  improvement log → edit (C7). Historical run descriptions (§2, §7) stay as records.
- `.opencode/agents/juice_agent.md:106-109` — flow diagram shows `→ deployment_agent`
  as the default terminus → edit (C8, one line).
- `.opencode/agents/trijam_gamedev.md` — legacy orchestrator; out of scope but flagged.

## Assumption to verify BEFORE editing (audit step)

Claim: current practice is already prepare-only, never auto-push.
Evidence so far: `gameotron_output/20261010_095651/butler-log.txt` ("PREPARE ONLY,
NO PUSH"); `deployment_agent.md:34-35` ("Never run `butler push` until the user has
explicitly confirmed"). Audit step: `rg -n "butler push" .opencode/agents/` and
confirm it appears only under an explicit-confirmation gate. If any path auto-pushes,
expand C3 to neutralize it before committing.

## Change set (L/M/S sizing)

### C1 [S] `.opencode/agents/gameotron.md` — Phase 1 note
After line 15, add a bullet: the official theme may be "Anything Goes" (content is
unconstrained), but a theme value is still recorded (`theme.txt`) and seeds ideation;
a `theme_override` (e.g. `with theme: X`) is sanctioned by the jam.

### C2 [S] `.opencode/agents/gameotron.md` — Phase 2 note
After line 20, add: the reviewed concepts are a pool to **choose from or adapt**; the
implemented game may adapt/merge ideas. The gate remains mandatory.

### C3 [M] `.opencode/agents/gameotron.md` — Phase 6 rewrite (lines 41-43)
Replace `Phase 6: Deployment / Use deployment_agent to prepare and deploy / Ask for
explicit user confirmation` with:

```
Phase 6: Deployment (SEPARATE, EXPLICITLY-REQUESTED RUN)
- The default pipeline ENDS at Phase 5.5. Hand control back to the user with the
  playable artifact at gameotron_output/<ts>/index.html for playtest BEFORE any deployment.
- Do NOT invoke deployment_agent in the default run. Run it only on explicit user request.
- When deployment_agent runs: prepare build/ assets and STOP before any `butler push`;
  the push requires an explicit confirmation in the current session.
```

### C4 [S] `AGENTS.md` — mirror
- Phase table, row 6 (line 52): "Separate, explicitly-requested run; prepare assets
  only, push on second confirmation."
- Add one line under the pipeline table: default run hard-stops after Phase 5.5 for
  user playtest; deployment is opt-in.
- Gotcha line 134: append the same "prepare-only; push on explicit confirmation."

### C5 [S] `CHANGELOG.md` — dated entry (before commit)
New 2026-10-10 section describing the three clarifications and C3/C4.

### C6 [S] `README.md` — Phase 6 (lines 170-173)
Reword "Deploy deliverables (user confirms first)" → "Separate, explicitly-requested
run; prepare assets, push on confirmation." (Promoted from optional to in-scope — the
README is the repo's standing pipeline description.)

### C7 [S] `PROCESS.md` — improvement log + standing claims
- Add a `### 4.7 Deployment is opt-in; a playtest stop ends the default run` subsection
  recording this change (this file *is* the jam's "configured/improved" deliverable).
- §6 Reproduction step 6: mark the deploy a **separate, explicitly-requested step after
  playtest**, not a normal pipeline step.
- Leave §2 and §7 run narratives as historical records (they describe completed runs).

### C8 [S] `.opencode/agents/juice_agent.md:106-109` — flow line
Change the terminal arrow so the documented flow ends at the playtest handoff; note that
`deployment_agent` runs only on explicit request.

## Explicitly out of scope

- `.opencode/agents/trijam_gamedev.md` (legacy; AGENTS.md says use gameotron.md) —
  flagged for drift, intentionally untouched.
- `COMPLIANCE.md` and per-run `gameotron_output/*` logs (historical records).
- No behavioral edits to `theme_agent` / `ideation_agent` / `evaluation_agent`
  (they already conform).
- `scripts/` untouched (verified: no script references these instruction files).

## Dependency order

- C1, C2 independent.
- C3 → C4 (mirror the executed orchestrator text into AGENTS.md).
- C6, C7, C8 after C3 (all mirror the same decision).
- C5 last (needs final wording).

## Verification

- **V0 (drift sweep, run first):** `rg -n "prepare and deploy|Phase 6|deployment_agent|butler push" --glob '*.md' .` to confirm no standing pipeline doc is missed beyond C4/C6/C7/C8. Classify each hit: historical record (leave) vs forward-looking claim (edit).
1. `rg -n "prepare and deploy" .opencode/agents/gameotron.md` → expect 0 matches.
2. Read Phase 6 of `gameotron.md` and row 6 of `AGENTS.md` side by side → identical meaning.
3. `rg -n "butler push" .opencode/agents/` → only under the explicit-confirmation gate.
4. Confirm C6/C7/C8 each state the same terminus (end at 5.5; deploy opt-in; push on 2nd confirmation).
5. Markdown only — no lint/typecheck/test suite applies; `scripts/` checks unaffected.

## Rollback

Single commit; `git revert` restores prior text. Rollback cost 1 (reversible edits).
Change sizing: S/S/M/S/S/S/S/S.

## User impact

No restart, no breaking change. Deployment becomes opt-in; the first playtest happens
before any upload.

## Open questions

- None outstanding; C6 now in scope. Re-confirm C8 (juice flow line) is wanted — it is a
  cosmetic doc alignment, not a behavior change.
