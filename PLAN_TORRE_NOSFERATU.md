# PLAN — Torre Nosferatu (jam submission game)

**Status:** DRAFT — `plan-review` passed (conditions below); awaiting user confirmation + Build mode.
**Scope:** Align docs to creative-direction Approach A, re-scope the Holotron plan set,
then run the GAMEOTRON pipeline to produce "Torre Nosferatu" as the jam submission game.
**Mode boundary:** PLAN is read-only. BUILD starts only on confirmation.
**Companion plans:** `PLAN.md` (Holotron), `PLAN_PHASE1.md` (Holonovel integration),
`PLAN_DEPLOY.md` (deployment critical path).

---

## 0. Execution order (critical path)

1. **A — Align docs** (this plan): revise the brief, re-scope the 5 plan docs.
2. **A3 — Contract check (RESOLVED, 2026-10-09)**: `world_agent` authors a *template* via
   `convert`; procgen lives in the game (`code_agent`); Phase 2 validates a *fixed seed* by
   constraint. No Holonovel code change (REQ-431 `generate` is ruleset-table-driven).
3. **B — Pipeline run**: `use gameotron` (theme override) → gate → design → code → review → juice.
4. **C — Consistency + deploy**: seeded layout check, fork push, `butler push` (D0 in progress).

A3 is resolved; B2 runs **with** `world_agent`. The no-`world_agent` fallback is retained
only as contingency (§7). A never blocks deployment.

---

## 1. Objective & done-bar

**Objective.** Ship a playable `index.html` for **Torre Nosferatu** — a turn-based,
candle-lit gothic-horror tower escape — generated through the GAMEOTRON pipeline, with
the submission's process documented, and deploy it to itch.io before **Oct 11 12:00**.

**Done-bar.**
1. `TORRE_NOSFERATU.md` reflects Approach A (single Dread dial, ~6 social actions,
   detail demoted to the GDD, terminology unified, Orlok rule reconciled).
2. The 5 plan docs name Torre Nosferatu as the submission and #7 as the Holonovel
   integration placeholder — no stale "#7 is the submission" claims remain.
3. A GAMEOTRON run produces `index.html` meeting every `COMPLIANCE.md` baseline
   requirement, with the mandatory approval gate honored.
4. The GDD owns the concrete social/Dread system (brief is direction, not design authority).
5. Seeded-layout consistency check reported (mismatch count) against the tower template at a
   fixed seed.
6. `PROCESS.md` finished with one before/after metric; public fork updated.
7. `butler push` succeeds; game live at the itch URL.

---

## 2. Verified facts (evidence)

| Fact | Evidence |
|---|---|
| Brief exists at root, Approach A not yet applied | `TORRE_NOSFERATU.md` (238 lines) |
| Brief-v2 grill resolved to Approach A / ~6 actions / demoted detail | `docs/grill-me/2026-10-09-torre-nosferatu-brief-v2-stress-test.md` |
| 5 plan docs name #7 as the submission (stale) | `PLAN.md` §6/§8; `PLAN_PHASE1.md` §1; `PLAN_DEPLOY.md` §8; `PROCESS.md` §2; `COMPLIANCE.md` |
| Holonovel supports `up`/`down` exits | `Holonovel-deployed/holonovel/src/world/model.ts:20-31` |
| A full pipeline run ≈ 44 min | `gameotron_output/20261009_123841/20261009_123841.log` `[123841]`→`[132200]` |
| `code_agent` has 0 retries | `AGENTS.md` retry policy |
| Deployment D0 (itch project + butler auth) in progress | user, this session |
| `manage_world(generate)` is ruleset-table-driven; ruleset-free ⇒ content-absent | `Holonovel-deployed/spec/02-requirements.md` REQ-431b; `holonovel/src/index.ts:3415` |

---

## 3. Decisions (with alternatives)

| Decision | Chosen | Alternatives rejected |
|---|---|---|
| Control tier | **Tier 2 — direct the pipeline** | Tier 1 hands-off (too little control); Tier 3 auteur (time) |
| Social system | **Approach A — single 0–8 Dread dial** | Full two-ledger + 11 actions (scope/validity); cut Dread (loses best idea) |
| Brief detail level | **Demote formulas/tables to the GDD** | Keep tables as must-haves (transcription/validity risk) |
| World-model role | **Static template (Holonovel) + seeded procgen in the game** | Fixed authored tower; procgen-in-code only; no world model |
| Wax-out | **Grace — the guttering dark** | Hard death (violates beginner-friendly rule) |
| Jam rules location | **Stay in `COMPLIANCE.md`** | Restate as REQ blocks in the brief (duplication) |
| This plan's file | **`PLAN_TORRE_NOSFERATU.md`** (new) | Append to `PLAN.md` (mixes fork + game) |

---

## 4. Steps

### Phase A — Align docs

**A1 — `<M>` Revise `TORRE_NOSFERATU.md` to Approach A.**
Edits: §3 unify on "guttering dark"; §5 Dread → single 0–8 dial, remove the
`effective = personal − floor(dread ÷ 2)` formula; §6.3 one disposition ledger + dial,
trim to **6 actions** (Share light, Ally, Bargain, Trade, Steal, Threaten), drop the
11-row table; §7 keep "Shades" only; §8/§9 Orlok rule = **wax-out triggers, Dread sets
closing speed**; §9 sequence social/Dread intro to **floor 2–3** and strip numbers;
§12 "shade whisper"; §15 update must-haves. **Resolves:** brief-v2 grill Medium
(cold-rush structural deterrent noted, not measured) and Low (terminology, onboarding,
detail demotion).
Verify: `git diff` shows the brief edited only; no formula/tier table remains; term grep
for "strangling" and "wraith" returns 0.

**A2 — `<M>` Re-scope the 5 plan docs (multi-file; register-coupled).**
- `PLAN.md` §6/§8: submission game = Torre Nosferatu; #7 = integration proof.
- `PLAN_PHASE1.md` §1/§5: reframe #7 as the Holonovel placeholder; add the Torre run.
- `PLAN_DEPLOY.md` §8: target game = Torre Nosferatu.
- `PROCESS.md` §2: chosen game = Torre Nosferatu (keep placeholders).
- `COMPLIANCE.md`: no rule change; note the submission game name.
Verify: `grep -rn "submission" PLAN*.md PROCESS.md` shows no "#7 is the submission" claim;
all five updated in one step (register coupling).

**A3 — `<S>` Template contract check — RESOLVED (2026-10-09).**
Decision: **procgen lives in the game**. `world_agent` authors a room-archetype **template**
via `manage_world(convert)`; `code_agent` generates floors from it seeded by `window.SEED`
and exposes `window.worldState()`; the Phase 2 check validates a **fixed seed** by constraint.
Rationale: Holonovel's `manage_world(action: generate)` is ruleset-table-driven and
content-absent ruleset-free (REQ-431), so it cannot produce a seeded tower here.
Verify: `TORRE_NOSFERATU.md` §14, `.opencode/agents/world_agent.md` (template contract), and
`.opencode/agents/code_agent.md` (world contract) all state the same contract.

### Phase B — Pipeline run (user at the approval gate)

**B1 — `<M>` Ideation.** Run `use gameotron with theme: <override>` (from the brief).
Pipeline generates 20 concepts → expert review → **human selects the Torres Nosferatu
concept at the mandatory gate**. Verify: `selected_concept.txt` exists; gate honored.

**B2 — `<M>` Design.** `world_agent` authors the tower template (`world_template.json`) →
`gdd_agent` produces the GDD (**owns the concrete Dread/social system**; scoped to the
floor-1 MVP core first) → `audio_agent` + `visual_agent` in parallel.
Verify: `gdd.md`, `visual_direction.txt`, `audio_direction.txt`; GDD honors brief must-haves.

**B3 — `<M>` Implementation.** `code_agent` → single `index.html`.
Verify: file exists; `node --check`-equivalent passes; compliance checklist against `COMPLIANCE.md`.

**B4 — `<M>` Review/fix loop.** `review_agent` + `puppeteer_agent` (parallel) → `bugfix_agent`,
≤3 cycles, stop when no CRITICAL/HIGH/MEDIUM. Verify: buglist + test reports; no open
CRITICAL/HIGH/MEDIUM.

**B5 — `<S>` Juice.** `juice_agent` (additives only, `juiceEnabled` toggle). Verify: game
still runs; `juice_report.txt`.

### Phase C — Consistency + deploy

**C1 — `<M>` Seeded-layout consistency check.** `puppeteer_agent` drives the game at a
**fixed seed**, compares observed rooms/things against the template's constraints; reports
mismatch count. **Fallback** if A3 failed: skip (documented).
Verify: mismatch count reported (target 0); findings → `bugfix_agent`.

**C2 — `<S>` Fork + docs.** Commit brief, plan re-scope, run artifacts; finish `PROCESS.md`
with the before/after metric; push to the public fork.
Verify: `git push` succeeds; `PROCESS.md` has a metric row.

**C3 — `<S>` Deploy.** `butler push build/ <user>/<game>:html5` after copying the real
`index.html` into `build/`; **user confirms before upload**. (D0 in progress.)
Verify: game live at the itch URL (or GUI fallback per `PLAN_DEPLOY.md`).

---

## 5. Verification

| Step | Verified by |
|---|---|
| A1 | `git diff` brief-only; formula/table gone; term grep clean |
| A2 | register-coupled update of all 5 docs; no stale submission claim |
| A3 | written capability confirmation, else documented fallback |
| B1 | `selected_concept.txt`; approval gate honored |
| B2 | `gdd.md` owns the social system; visual/audio present |
| B3 | `index.html` + compliance checklist |
| B4 | reports; no CRITICAL/HIGH/MEDIUM |
| B5 | game runs; `juice_report.txt` |
| C1 | mismatch count reported |
| C2 | fork updated; metric present |
| C3 | live URL (or fallback) |

---

## 6. Edge cases & failure handling

| Case | Handling |
|---|---|
| ~~A3 template capability absent~~ | **Resolved** — procgen is game-side; `world_agent` authors a template (§3/§4). No-`world_agent` fallback kept as contingency only |
| Phase 2 hook absent in the generated game | checker **fails closed** → "unverified", never pass |
| `code_agent` (0 retries) aborts | resume-at-phase (§4) reusing GDD/direction artifacts |
| No shippable Torre build by **T-6h** | cut wave-2 (social/Dread); ship the floor-1 core + known-issues |
| Ideation yields no vampire-tower concept | refine theme string / re-run (~44 min); pick closest, title it |
| Review loop hits 3 cycles with issues | ship at current state; log remaining as known issues |
| butler push fails | itch app GUI fallback (`PLAN_DEPLOY.md` D4-alt) |
| Deadline pressure | C3 outranks C1 (deploy > consistency check) |

---

## 7. Metric, risks, rollback

**Metric (before/after, for `PROCESS.md`).** Design-time world warnings + seeded-layout
mismatch count, with #7's baseline as the "no-template" column.

| Risk | Mitigation |
|---|---|
| A3 template capability not delivered | plain-run fallback; deploy stays on critical path |
| Second run + doc edits overrun | run ≈44 min; A is doc-only; C3 outranks C1 |
| Brief re-grows into a spec | A1 acceptance: no formula/tier table; GDD owns detail |

**Rollback cost: 1** (A1/A2 reversible edits; B/C artifacts additive; git revert of one commit).

---

## 8. User impact & change sizing

- **User actions:** A3 confirmation with the other session; presence at the B1 approval gate;
  confirm deployment before C3. D0 (itch project + butler auth) already in progress.
- **Restart:** opencode restart if any config/agent change (not required by this plan).
- Sizing: A1 M · A2 M · A3 S · B1–B4 M · B5 S · C1 M · C2 S · C3 S.

---

## 9. Related plans

- `PLAN_PHASE1.md` — Holonovel integration (A3 depends on its capability).
- `PLAN_DEPLOY.md` — deployment critical path (C3 depends on D0/D1–D7).
- `docs/grill-me/2026-10-09-torre-nosferatu-brief-v2-stress-test.md` — source of A1's fixes.
