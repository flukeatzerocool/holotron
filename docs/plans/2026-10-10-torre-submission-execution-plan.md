# Plan: Torre Nosferatu — run to submission

Status: **Draft (pending plan-review)** · Date: 2026-10-10 · Goal owner: human (present at the gate)
Source grill: `docs/grill-me/2026-10-10-torre-submission-execution-stress-test.md`
Reconciliation: `docs/plans/2026-10-10-torre-prerun-reconciliation-plan.md` — **this plan is
authoritative for the run**; `2026-10-10-torre-npc-floors-amendment-plan.md` is incorporated.
Deadline (hard): **2026-10-11 12:00** (`COMPLIANCE.md:3`)

## Goal

Produce **and submit** the Torre Nosferatu entry — a single-file browser game **generated through
GAMEOTRON**, plus an extended `PROCESS.md` — before the jam closes, satisfying `COMPLIANCE.md`.
"Torre or bust": no fallback game. Wave-3 (shared-resource survivor sim) **required, flag-gated**.

## Scope

- **In:** commit the brief edits; execute the full pipeline run; verify the B7 gate + Phase 2
  checker (C5); extend `PROCESS.md`; update `ROADMAP.md`/`CHANGELOG.md`; deploy + submit.
- **Out:** `world_template.schema.json` structure; Holonovel source; `opencode.json`; deployment
  path/scripts; cutting wave-1/2; a fallback game.

## Decisions locked

| Decision | Chosen | Rejected — why |
|---|---|---|
| Submission target | Torre only | Rule Breaker fallback — user: Torre is the submission |
| Shippable scope | Wave-1 + 2 + 3 (all required) | Wave-1/2-only — user requires the full sim |
| Wave-3 de-risk | **Flag-gated sub-features** (NPC item use / creatures attacking NPCs / trap-tripping), `juiceEnabled` pattern | All-or-nothing — no landing pad on an unknown-duration run |
| Approval gate | Ideation runs, gate fires, user selects Torre | Skip ideation — fails `COMPLIANCE.md:30-32`; predetermination is an authenticity note only |
| Theme input | Brief §"Run with" command (`theme: Torre Nosferatu — …`) | Naming the finished game in the theme — gate-theater risk; keep the brief's current string |
| itch.io project | **New project** for Torre Nosferatu (the game half) — separate from the live `holotron` pipeline page | Reusing the `holotron` page — it is the pipeline/process half, not the game |

## Phase 0 — Pin the input (pre-run)

- **P0.1 [S] — DONE (`3c9b98f`).** The uncommitted work is committed (`TORRE_NOSFERATU.md`
  expansions, stress-test reports, this plan); `git status` clean. Run input pinned.
- **P0.2 [M] — DONE (`3c9b98f`).** The flag-gating requirement is present in both places:
  `TORRE_NOSFERATU.md` §15 (`:382-389`) and `gdd_agent.md`'s acceptance checklist (`:26-29`).
- **P0.3 [S] — DONE.** Confirmed: the invocation string equals the brief's "Run with" line
  (`TORRE_NOSFERATU.md:16`).
- **P0.4 [S] — USER ACTION (pending).** Create the **new itch.io project for Torre Nosferatu**
  (the game half) and join the jam; separate from the live `holotron` page (the **pipeline/process
  half**, `PROCESS.md`). Requires the itch.io web UI + account — not automatable from here.
  COMPLIANCE requires "itch.io project created; jam joined".

## Phase 1 — Execute the pipeline run

- **P1.1 [L]** Run `gameotron` with the theme override. **User must be present** for the mandatory
  approval gate (Phase 2 of the pipeline). Select the Torre concept at the gate.
- Run order per `AGENTS.md`: ideation → review → **gate** → evaluation → `world_agent` → `gdd_agent`
  → audio+visual → `code_agent` → [review + puppeteer → bugfix] ×N → `juice_agent` → `deployment_agent`.
- **Output:** `gameotron_output/<ts>/` containing `direction.txt`, `world_template.json`,
  `gdd.md`, `index.html`, plus reports.
- **Verify:** run folder has all artifacts; log complete. **Unverified until run.**

## Phase 2 — B7 gate (`ROADMAP.md:14-17`)

- Confirm **social + Dread actually shipped**: `window.systemState()` is **tower-wide** — a
  non-null `dread` clock + ≥1 NPC at the **pristine boot state** (on the Spire), per the brief's
  state-vs-simulation rule (§14); `window.social(id)` exists and calls the UI handler; a
  `required_encounters` entry is reachable on `test_seed`; `worldState()` stays **active-floor**
  (pre-mutation).
- Confirm **wave-3 flag-gated sub-features** exist and toggle (new requirement, this grill).
- **Verify:** `puppeteer_agent` Phase 2 run against the built game.

## Phase 3 — C5 end-to-end checker

- **P3.1 [S] Dry-run the gate.** Run `scripts/check_template.mjs --fail-on spatial` against the
  real Torre artifacts on `test_seed` and **record every finding before promising green**; resolve
  or explicitly record each. (Plan-review §1 error-gate dry run.)
- **Verify:** spatial = 0; advisory systemic count recorded. Existing checker only — no new gate.

## Phase 4 — Process documentation

- **P4.1 [M]** Extend `PROCESS.md` with the Torre run (replace the "pending" note, `PROCESS.md:7-9`):
  invocation, phases/outputs, the before/after metric table, deployment. The judged "documented
  process" half is incomplete until this lands. **Precondition: P1-P3 artifacts exist.**
- **P4.2 [S]** Update `ROADMAP.md` (mark B7/C5 done) and `CHANGELOG.md`; commit.

## Phase 5 — Deploy & submit

- **P5.1 [M]** Build `build/index.html`; `deployment_agent` pushes via butler to the **Torre
  Nosferatu** project (P0.4). **User confirms before upload.**
- **P5.2 [S]** Confirm the itch.io project is public + the jam is joined; **submit before
  2026-10-11 12:00.**

## Dependency order

P0 → P1 → P2 → P3 → P4 → P5. P3 depends on P1's build; P4 depends on P2/P3 results; P5 last.
P0.1-P0.4 are independent of each other.

## Verification

1. **P0** — `git status` clean; `grep` the flag-gating text in the brief + `gdd_agent.md`.
2. **P1** — run folder complete (manual). *Unverified until the run.*
3. **P2** — Phase 2 report: dread + NPC present, `social(id)` live, encounter reachable, boot state
   reproducible, wave-3 flags toggle.
4. **P3** — `check_template.mjs --fail-on spatial` exit 0; systemic count recorded.
5. **P4** — `PROCESS.md` §5 metric table populated from the run's artifacts. *Unverified until run.*
6. **P5** — `butler status`; itch.io page resolves live; submission timestamp < deadline.

## Rollback

- P0-P4: prose/spec edits under git — rollback cost **1** (reversible).
- P5: the itch.io upload is **not** reversible in-repo (public artifact); a bad build is superseded
  by a re-push (cost **2**, destructive-of-live-state). No data/dependency state touched.

## Risks

- **[HIGH] No fallback + required wave-3 on an unknown-duration run.** Mitigation: flag-gated
  sub-features; run starts immediately; user present at the gate. Residual: if the build is
  unstable at the deadline, there is no entry.
- **[MED] `PROCESS.md` documents the wrong game until P4.** Mitigation: P4 is a hard pre-submit step.
- **[MED] Brief propagation assumed.** Mitigation: `gdd_agent` acceptance checklist; inspect
  `gdd.md` for must-haves immediately after Design (P1).
- **[MED] Per-floor escalation prose-only/untested** (prior H5). Accepted: systemic is advisory.

## Success criteria

- `gameotron_output/<ts>/` contains `direction.txt`, `world_template.json`, `gdd.md`, `index.html`.
- B7 pass: `systemState()` dread + ≥1 NPC; `social(id)` live; encounter reachable on `test_seed`;
  wave-3 sub-features flag-gated and present.
- `check_template.mjs --fail-on spatial` → 0 spatial mismatches.
- `PROCESS.md` documents the Torre run + before/after metric.
- itch.io submission live before 2026-10-11 12:00.
