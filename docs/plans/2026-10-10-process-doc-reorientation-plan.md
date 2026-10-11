# Plan: PROCESS.md reorientation for GAMEOTRON devs

Status: **plan-review passed (2026-10-10)** · Date: 2026-10-10 · Goal owner: human
Sources:
- `docs/grill-me/2026-10-10-process-doc-reorientation-stress-test.md` (premise + falsifier)

Deadline context: jam closes **2026-10-11 12:00**; deployment (`ROADMAP.md` D) still pending.

## Goal

Make `PROCESS.md` the document a GAMEOTRON developer reads to understand **every change this
fork makes to GAMEOTRON in order to produce Torre Nosferatu** — the "documented fork" the jam
asks participants to publish. Relocate the judge-facing process summary into `COMPLIANCE.md` so
the judged artifact stays self-contained (Option A).

Falsifier (accepted): *a cold reader cannot independently reproduce Torre from `PROCESS.md`*.

## Scope

- **In:** `PROCESS.md` (retitle + purpose + curated delta table + §7.5 Torre reproduction);
  `COMPLIANCE.md` (self-contained process-summary section + pointer fix); `CHANGELOG.md` entry;
  persist grill report.
- **Out:** code, agents, `opencode.json`, `world_template.schema.json`, deployment; physically
  reordering sections; renumbering; rewriting frozen `CHANGELOG.md`/dated `docs/` entries.

## Decisions locked

| Decision | Chosen | Rejected — why |
|---|---|---|
| Audience | Self-serve porters / documented-fork readers | "Upstream PR target" — no contribution channel exists in-repo |
| Reorient method | **Reframe in place** (anchor-stable) | Physical reorder + renumber — breaks `ROADMAP.md:41` §4.4 and `CHANGELOG.md` §4.x |
| Change inventory | Curated delta table + link to `CHANGELOG.md` | Full duplicated table — drift risk; "git only" — no rationale view |
| Judge artifact | Short prose summary added to `COMPLIANCE.md` | Keep checklist only — weakest split; move whole narrative — drift |
| Timing | Execute full split now | Defer post-deadline — user chose immediate |

## Phase 1 — PROCESS.md (dev-facing)

- **P1.1 [S]** Retitle + rewrite the purpose block (`PROCESS.md:1-22`): state the dev audience;
  name it the jam's "documented fork" sharing artifact; one line that the judge summary now lives
  in `COMPLIANCE.md`; add a reading path (§7 = Torre submission, §2–6 = baseline proof).
- **P1.2 [M]** Insert a **curated "Changes vs upstream GAMEOTRON" table** in §1 (additive):
  columns `artifact → change → rationale → dependency (Holonovel | dependency-free)`. End the
  table with "exhaustive list: see `CHANGELOG.md`."
- **P1.3 [M]** Add new **§7.5 "Reproduction (Torre)"** (additive, under existing §7):
  `direction.txt` handoff → approval gate → concept #14 → multi-floor `down`/`up` contract;
  pointer to which run-folder artifacts to read. Satisfies the accepted falsifier.
- **P1.4 [S]** Light touch on §4.5/§4.6/§4.7 (`:135`,`:138`,`:151`): move only sentences that
  explicitly address the jam to `COMPLIANCE.md`; leave the improvement subsections intact. **Do
  not renumber any section.**

## Phase 2 — COMPLIANCE.md (judge-facing, self-contained)

- **P2.1 [S]** Add a ~1-screen "Documented process (summary)" section: use / configuration /
  improvement + one before/after metric, self-contained.
- **P2.2 [S]** Update `COMPLIANCE.md:24` to point at the new summary (with `PROCESS.md` for depth).

## Phase 3 — Bookkeeping

- **P3.1 [S]** Add one dated entry to `CHANGELOG.md`; note that frozen anchors in `CHANGELOG.md`
  and dated `docs/` are intentional.
- **P3.2 [S]** Persist the grill report to
  `docs/grill-me/2026-10-10-process-doc-reorientation-stress-test.md`.

## Dependency order

P1 → P2 → P3. P2.2 depends on P2.1. P3 (changelog) last. P1.3 independent of P1.2.

## Verification

1. **P1.3 falsifier dry-run** — cold-read `§1 + §7.5`; confirm a reader can identify the changes
   and the Torre reproduction path without outside context. *Falsifier.*
2. **Anchor check** — `grep -rn "PROCESS.md §" ` across live docs: `ROADMAP.md:41` (§4.4) and
   `CHANGELOG.md` (§4.4/4.5/4.6/4.7) still resolve.
3. **P2** — re-read `COMPLIANCE.md` top-to-bottom; the documented-process requirement is met
   without `PROCESS.md`.
4. **P3.1** — `CHANGELOG.md` entry present (per `AGENTS.md` changelog rule).

## Rollback

Reversible doc edit across 3 files (`PROCESS.md`, `COMPLIANCE.md`, `CHANGELOG.md`) — cost **1**.
No code/config/deps/destructive state. No behavioral change to the pipeline.

## Risks

- **[MED] Delta table drifts from `CHANGELOG.md`.** Mitigation: table carries rationale +
  dependency tags only; enumeration deferred by link.
- **[LOW] `COMPLIANCE.md:24` pointer missed.** Mitigation: P2.2 explicit; verification step 3.
- **[LOW] Frozen dated anchors go stale if any renumber sneaks in.** Mitigation: P1.4 forbids
  renumbering; verification step 2.

## Success criteria

- `PROCESS.md` opens dev-facing, carries the curated changes table, and has a Torre reproduction
  section a cold reader can follow.
- All live `PROCESS.md` § anchors still resolve.
- `COMPLIANCE.md` stands alone as the judge's documented-process artifact.
- `CHANGELOG.md` updated; grill report persisted.
