# Plan: Torre Nosferatu — run to submission

Status: **Draft (revised — pending plan-review)** · Date: 2026-10-10 · Goal owner: human (present at the gate)
Sources:
- `docs/grill-me/2026-10-10-torre-run-readiness-stress-test.md` (run-execution decisions)
- `docs/grill-me/2026-10-10-torre-plan-reground-stress-test.md` (framework/brief reconciliation)
- `docs/plans/2026-10-10-torre-prerun-reconciliation-plan.md` (incorporated)
This plan **supersedes** `2026-10-10-torre-npc-floors-amendment-plan.md` (incorporated, not re-run).
Deadline (hard): **2026-10-11 12:00** (`COMPLIANCE.md:3`) · Now: 2026-10-10 ~09:46 EDT (~26h).

## Goal

Produce **and submit** the Torre Nosferatu entry — a single-file browser game **generated through
GAMEOTRON**, plus an extended `PROCESS.md` — before the jam closes, satisfying `COMPLIANCE.md`.
"Torre or bust": **no fallback game**, **no freeze time**. Wave-3 (shared-resource survivor sim)
**required, flag-gated**.

## Scope

- **In:** execute the full pipeline run; verify B7 + C5; extend `PROCESS.md`; update
  `ROADMAP.md`/`CHANGELOG.md`/`COMPLIANCE.md`; deploy + submit.
- **Out:** `world_template.schema.json` structure; Holonovel source; `opencode.json`; deployment
  path/scripts; cutting wave-1/2; a fallback game.

## Decisions locked

| Decision | Chosen | Rejected — why |
|---|---|---|
| Submission target | Torre only | Rule Breaker fallback — user: Torre is the submission |
| Freeze / fallback | **None** ("Torre or bust") | Timed freeze — user rejected; residual accepted |
| Shippable scope | Wave-1 + 2 + 3 (all required) | Wave-1/2-only — user requires the full sim |
| Wave-3 de-risk | **Flag-gated behaviour**, `juiceEnabled` pattern | All-or-nothing — no landing pad |
| Testable hooks | **Frozen** — flags may not gate `social(id)` / required encounter / NPC+Dread state | Flaggable hooks — would force fail-closed "unverified" → no-submit |
| Approval gate | Ideation runs, gate fires, user selects Torre-shaped concept; override recorded in `PROCESS.md` | Skip ideation — fails `COMPLIANCE.md:30-32` |
| Theme input | Brief's "Run with" string (`TORRE_NOSFERATU.md:16`) | Naming the finished game — gate-theater risk |
| B7 / C5 | **Hard submission gates** (fail ⇒ no submission) | Advisory — user chose hard |
| Review-loop bar | After 3 cycles, ship as-is with open MEDIUMs in the buglist | Extend to clean — no time budget |
| itch.io project | **New project** (game half), separate from live `holotron` (process half) | Reuse `holotron` — it is the pipeline page |
| Definition of done | Butler push succeeds **AND** page resolves live **AND** jam entry in; pre-flight verified email + Public | "Push is enough" — contradicted by `PROCESS.md:88-89` |

## Phase 0 — Pin the input (pre-run)

- **P0.1 [S] — DONE (`876cb87`).** Working tree clean (`git status --short` empty). Run input pinned.
- **P0.2 [S] — DONE.** Flag-gating requirement present in `TORRE_NOSFERATU.md` §15 and
  `gdd_agent.md` acceptance checklist.
- **P0.3 [S] — DONE.** Invocation string == brief's "Run with" line.
- **P0.4 [S] — USER ACTION (pending, precondition for Phase 1).** Create the **new itch.io
  project for Torre Nosferatu**, join the jam, **verify the account email**, leave the project
  **Private** now (flip to **Public** at P5). Requires the itch.io web UI.
- **P0.5 [S]** Create `gameotron_output/<ts>/`, start `gameotron_output/<ts>/<ts>.log` (new file,
  never append), and write the brief to `gameotron_output/<ts>/direction.txt` (passed to `gdd_agent`).

## Phase 1 — Execute the pipeline run

- **P1.1 [L]** Run `gameotron` with the theme override. **User present** for the mandatory approval
  gate (pipeline Phase 2); select the Torre-shaped concept.
- Run order per `AGENTS.md`: ideation → expert review → **gate** → evaluation → `world_agent` →
  `gdd_agent` → audio+visual (parallel) → `code_agent` → [review + puppeteer → bugfix] ×N (≤3) →
  `juice_agent` → `deployment_agent`.
- **P1.2 [S] — Design-phase acceptance check (immediately after `world_agent` + `gdd_agent`).**
  Inspect `world_template.json`: **non-null `test_seed`**; a **`required_encounters`** entry with
  `reachable: true` on that seed; ≥1 `npcs` entry; a `clocks[]` `tug_of_war` Dread entry with
  `tiers`. Also confirm `gdd.md` carries the brief's must-haves (§15) and a Screen Inventory ≥6
  incl. Pause music/SFX toggles. A miss here is a **no-submit risk** — fix before code_agent, not
  at Phase 2 (this is the grill's H1 mitigation).
- **Output:** `gameotron_output/<ts>/` with `direction.txt`, `world_template.json`,
  `world_template.txt`, `gdd.md`, `index.html`, and reports. **Unverified until run.**

## Phase 2 — B7 gate (hard)

- Confirm **social + Dread shipped** and **hooks frozen**: `window.systemState()` returns a
  **tower-wide** roster — non-null `dread` + ≥1 NPC — at the **pristine boot state** (on the Spire);
  `window.social(id)` exists and calls the **same handler the UI uses**; a `required_encounters`
  entry is reachable on `test_seed`; `worldState()` reports the **active floor** (pre-mutation).
- Confirm **wave-3 flag-gated sub-features** exist and toggle **without gating any hook** (frozen
  surfaces): with a sub-feature flag off, `social(id)`, the required encounter, and NPC/Dread state
  remain present (so the checker stays green, not "unverified").
- **Verify:** `puppeteer_agent` Phase 2 run + `state_<seed>.json`; fail-closed semantics mean
  "unverified" = **fail** here.

## Phase 3 — C5 end-to-end checker (hard on spatial)

- **P3.1 [S] Dry-run the gate first.** Run `scripts/check_template.mjs --fail-on spatial` against
  the **real Torre artifacts** on `test_seed` and **record every finding before promising green**;
  resolve or explicitly record each. (Existing checker only — no new gate; `scripts/` already owns
  this finding class, so no duplicate gate.)
- **Verify:** spatial = 0 (exit 0); advisory systemic count recorded in the Phase 2 report. Systemic
  findings do not block (policy: rooms hard, systemic advisory).

## Phase 4 — Process documentation

- **P4.1 [M]** Extend `PROCESS.md` (replace the "pending" note, `PROCESS.md:7-9`): invocation,
  phases/outputs, the before/after metric table, the **two itch.io pages** (game vs process),
  and deployment. Precondition: P1–P3 artifacts exist.
- **P4.2 [S]** Update `ROADMAP.md` (mark B7/C5 done), `CHANGELOG.md`, and tick `COMPLIANCE.md`;
  commit per the `changelog-before-commit` skill.

## Phase 5 — Deploy & submit

- **P5.1 [M]** Build `build/index.html`; `deployment_agent` pushes via butler to the new Torre
  project (P0.4). **User confirms before upload.**
- **P5.2 [S]** Set the project **Public**; confirm the page **resolves live**; confirm the **jam
  entry is in**; **submit before 2026-10-11 12:00.**

## Dependency order

P0 → P1 (P1.2 inside P1) → P2 → P3 → P4 → P5. P1.2 gates P1's code_agent step. P3 depends on P1's
build; P4 on P2/P3; P5 last. P0.1–P0.4 independent of each other (P0.4 blocks P1).

## Verification

1. **P0** — `git status` clean; P0.4 page + jam join + verified email confirmed by user.
2. **P1.2** — `world_template.json` has non-null `test_seed`, reachable required encounter, ≥1 NPC,
   Dread clock; `gdd.md` has ≥6 screens + must-haves.
3. **P2** — Phase 2 report: dread + NPC present, `social(id)` live, encounter reachable, pristine
   boot reproducible, wave-3 flags toggle hooks-independently.
4. **P3** — `check_template.mjs --fail-on spatial` exit 0; systemic count recorded.
5. **P4** — `PROCESS.md` §5 metric table populated. *Unverified until run.*
6. **P5** — `butler status`; page resolves live; submission timestamp < deadline.

## Rollback

- P0, P2, P4, P5-config: prose/config edits under git — rollback cost **1** (reversible).
- P1 (generated artifacts): regenerate or discard the run folder — cost **1**.
- P5 upload: the itch.io push is **not** reversible in-repo (public artifact); a bad build is
  superseded by a re-push — cost **2** (destructive-of-live-state). No data/dependency state touched.

## Risks

- **[HIGH] No freeze + hard B7/C5 + required wave 3 on a never-run pipeline (~26h).** Mitigations:
  P1.2 Design-phase acceptance check; frozen hooks; P3.1 dry-run-before-green; user present at the
  gate; start immediately. **Residual:** if the build is unstable at the deadline, there is no entry.
- **[MED] `PROCESS.md` documents the wrong game until P4.** Mitigation: P4 is a hard pre-submit step.
- **[MED] Per-floor escalation prose-only/untested.** Accepted: systemic advisory.
- **[MED] Encounter trigger vs checker** (`social(id)` driven directly). Accepted: advisory.

## Success criteria

- `gameotron_output/<ts>/` contains `direction.txt`, `world_template.json`, `gdd.md`, `index.html`.
- P1.2 acceptance check passes (non-null `test_seed` + reachable required encounter).
- B7 pass: `systemState()` dread + ≥1 NPC; `social(id)` live; encounter reachable on `test_seed`;
  wave-3 sub-features flag-gated and hook-independent.
- `check_template.mjs --fail-on spatial` → 0 spatial mismatches.
- `PROCESS.md` documents the Torre run + before/after metric; `COMPLIANCE.md` ticked.
- itch.io submission live (page resolves + jam entry) before 2026-10-11 12:00.
