# Stress-Test Report: Holotron Phase 1 (Holonovel integration)

- Verdict: **READY_WITH_RISKS**
- Score: **70/100**
- Questions asked: 9
- Dimensions covered: 7/7
- Chosen approach: **Modified path** — world-bearing concept (#7) + Phase 1 & Phase 2 bundled + machine-readable world contract

## Blast Radius
- **Repos:** `holotron` fork (project `opencode.json`, `scripts/holonovel-mcp.sh`, `.opencode/agents/world_agent.md`, additive `gameotron.md`/`AGENTS.md` edits); Holonovel consumed as an external MCP dependency (untouched).
- **State/data:** project-local `.holonovel-state/` (gitignored); new concept #7 GAMEOTRON run artifacts.
- **Game:** the current Everything Button build is superseded by a new #7 run.
- **Jam risk:** a green pipeline with no submission if the #7 run fails (see accepted risk).

## Biggest Pushback
The original plan's wedge (Holonovel world model) is a **spatial** engine, but the approved game (#20 The Everything Button) has **no spatial world** — so Phase 1 would have been cosmetic and Phase 2's consistency check vacuous. Resolved by switching to #7 Rule Breaker Dungeon and bundling Phase 2 with a machine-readable world contract.

## High Severity
- [ ] **No submission fallback (user-overridden).** The finished, tested Everything Button build is abandoned; if the #7 run aborts (`code_agent` has 0 retries), the user submits nothing. User explicitly chose this to force the integration to succeed. Mitigated in part by the new resume-at-phase path.
- [ ] **Integration value is modest.** Holonovel validates world *structure* (rooms/exits), not content quality; assertions remain LLM-authored. The single-run proxy metric must actually show a benefit, or the "reliability improvement" claim is hollow.

## Medium Severity
- [ ] **Time:** Phase 1 build + full #7 pipeline rerun (4-8h + human gate) + Phase 2 + Linux fix + docs + upload inside ~46h.
- [ ] **Reproducibility** of the shared fork (local Holonovel path) — mitigated by env-var wrapper + published artifacts, not fully closed.
- [ ] **Phase 2 determinism** now depends on the world contract (`world_map.json` -> `window.WORLD`); code_agent must honor it or the check degrades to best-effort.

## Low Severity
- [ ] Top-level `permission` object in project config replaces the global `"allow"` (verify agent-level overrides still behave).
- [ ] `read_mcp_resource` denied globally could affect other MCP resource reads inside the project (not used there).
- [ ] `.holonovel-state/` gitignore + first-run bootstrap.

## Unresolved
- [ ] None blocking. (No-submission fallback is accepted/overridden, not unresolved.)

## Well-Defined (resolved during grill)
- [x] World/game mismatch — switched to #7 Rule Breaker Dungeon.
- [x] Phase 2 bundled; machine-readable contract specified.
- [x] Empty/invalid world -> one retry with fresh Novel, then loud degrade.
- [x] code_agent abort -> resume-at-phase path.
- [x] Before/after metric -> single-run proxy (convert warnings + Phase 2 mismatches).
- [x] Fork reproducibility -> env-var wrapper + published artifacts.

## Well-Defended
- [x] Wedge pinned to `convert` with authored assertions (`generate` content-absent ruleset-free).
- [x] Additive-only orchestrator edit; phase order + approval gate preserved.
- [x] Scoping via permission with named fallback (enumerated deny-list).
- [x] Spike-first with a kill criterion and a documented fallback to the Linux fix.

## Recommended Next Step
Revise `PLAN_PHASE1.md` to fold in every resolution above (concept #7, bundled Phase 2, `world_map.json` contract, resume path, empty-world retry/degrade, env-var wrapper, proxy metric), then run **`plan-review`** on the revised plan before Build. Do **not** begin implementation until the revised plan is reviewed.

---

grill-me READY_WITH_RISKS. Holotron Phase 1 — 70/100, 0 unresolved high
