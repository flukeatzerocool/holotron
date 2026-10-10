# Plan — Close the audio verification gap (minimal wedge)

Status: draft per `docs/grill-me/2026-10-10-audio-verification-rec-stress-test.md`
(READY, 84/100). Approach A — one mechanism + one principle.
Supersedes nothing; the Torre `window.audioTest()` is the reference implementation.

## Problem

The Torre Nosferatu game shipped with a dead/inaudible audio subsystem and the
pipeline still reported "clean": `review_agent` and `puppeteer_agent` rubrics have
**zero audio coverage**, so silence passed as success.
Root cause: *a subsystem is unverified unless a rubric names it.*

## Scope discovery (done in pre-scan, recorded here)

- `rg audioTest|rms|OfflineAudio .opencode/agents/` → **no audio check exists** in any
  agent rubric. Confirmed no duplicate gate to reconcile.
- The reference hook already exists: `gameotron_output/20261010_095651/index.html:2071`
  `window.audioTest=function(scenario,seed,opts){ return Audio.offline(...); }` →
  `Promise<{rms, peak, bandRms}|null>` (impl. index.html:991–1007). The mandated
  contract below **matches this exemplar**; do not invent a new shape.

## Goal

Every future pipeline game with a Web Audio graph exposes the same `window.audioTest`
exemplar and self-declares thresholds, so a wired-but-dead subsystem is reported —
without ever blocking a valid game.

## Files

| ID | File | Change | Size | Rollback |
|---|---|---|---|---|
| F1 | `.opencode/agents/code_agent.md` | mandate `window.audioTest()` + `window.AUDIO_SPEC` (match exemplar) | S | 1 |
| F2 | `.opencode/agents/audio_agent.md` | add small-speaker reproduction constraint | S | 1 |
| F3 | `.opencode/agents/puppeteer_agent.md` | add advisory audio check (§Phase 2b) | M | 1 |
| F4 | `AGENTS.md` | hook in code_agent row + Game Requirements; check in puppeteer row | S | 1 |
| F5 | `scripts/audio-check/{dead-bed,good-bed}.html` + `README.md` | known-dead vs known-good controls | S | 0 |
| F6 | `PROCESS.md` | §4.6 one-paragraph principle + Torre citation | S | 1 |
| F7 | `CHANGELOG.md` | date-stamped bullet (via `changelog-before-commit`) | S | 1 |

Total rollback cost: 1 (`git checkout` F1–F4, F6, F7; delete F5).

## Steps

### Step 1 — Mandate the hook, matching the exemplar (`code_agent.md`, `AGENTS.md`) — S
Add to `code_agent.md` "Required hooks", using the **shipped Torre signature** verbatim:

- `window.audioTest(scenario, seed?, opts?) → Promise<{rms, peak, bandRms} | null>`
  — renders one scenario deterministically via `OfflineAudioContext`
  (`|| webkitOfflineAudioContext`); returns `null` when offline rendering is unavailable
  (the checker then falls back to the live gain-graph probe).
- `window.AUDIO_SPEC = { scenarios:[{id, kind:"bed"|"cue"}],
  thresholds:{ bed:{rms, bandRms}, cue:{rms} }, overrides?:[{id, reason, rms}] }`
  — declares which scenarios exist and the game's own floor; a game may declare an
  override **with a reason**. Games with no `AudioContext` declare `{ applicable:false }`.
- `AGENTS.md`: add `window.audioTest()` / `window.AUDIO_SPEC` to the `code_agent`
  data-flow row and an audio line under Game Requirements.

### Step 2 — Direction constraint (`audio_agent.md`) — S
Add to the output spec: the ambient bed must target **audibility on small/laptop
speakers** — an explicit dB floor and **no sub-150 Hz-only bed** (the Torre root cause).
State that `code_agent` implements these and `puppeteer_agent` checks them.

### Step 3 — The advisory check (`puppeteer_agent.md`) — M
Add **§Phase 2b — audio check**, run after the world-model check:
1. No `AudioContext` and no `window.audioTest` → **N/A**, skip.
2. `AudioContext` present but no `window.audioTest` → **UNVERIFIED** (advisory flag).
3. Else enumerate `AUDIO_SPEC.scenarios`; for each, `await window.audioTest(id, <spec seed>)`
   and assert `rms ≥ threshold` (bed also `bandRms ≥ threshold`). Threshold = the game's
   declared value, else the **fixed default floor**; an `overrides[]` entry lowers one
   scenario's floor only by its declared `reason`.
4. If `audioTest` returns `null` for every scenario (offline unavailable) → run the
   live gain-graph probe instead and record which path ran.
5. Severity: **advisory** — a miss is logged `[AUDIO][advisory]` and MUST NOT be promoted
   to a bugfix-triggering severity.
6. Write `audio_report_HHmmss.txt` (per-scenario rms/bandRms, thresholds, path, verdict).
7. **Control (anti-vacuity):** before trusting green, run the check against F5 —
   `dead-bed.html` must miss its floor, `good-bed.html` must pass.

### Step 4 — Control fixtures (`scripts/audio-check/`) — S
Two minimal self-contained HTML files exposing the mandated `audioTest`/`AUDIO_SPEC`,
one with an intentionally inaudible bed and one audible; `README.md` with the exact
`playwright-cli` run command (dependency-free, per the repo's no-npm rule).

### Step 5 — Principle (`PROCESS.md` §4.6) — S
One paragraph: "a subsystem is unverified unless a rubric names it," citing Torre audio
(bed inaudible by construction; pipeline green) as the case; cross-ref Step 3.

### Step 6 — Registers — S
`CHANGELOG.md` date-stamped bullet at commit time (`changelog-before-commit`).

## Verification

1. Run the check against `dead-bed.html` → misses floor; `good-bed.html` → passes
   (proves non-vacuous; headless via `playwright-cli`; manual fallback: a fixture with a
   deliberately-zeroed bed).
2. Run against `gameotron_output/20261010_095651/index.html` (has `window.audioTest`,
   no `AUDIO_SPEC`) → **UNVERIFIED (advisory)** — proves the hook-present/spec-absent
   branch and that the check does not falsely pass. Optionally backfill `AUDIO_SPEC`
   into Torre to demonstrate a true PASS on the exemplar.
3. Grep F1–F4 for the hook name — identical string across all files.
4. No pipeline run required — these are instruction/contract edits.

## Success criteria

1. `window.audioTest` signature is byte-identical in `code_agent.md`, `AGENTS.md`, and
   the Torre exemplar; `puppeteer_agent.md` calls exactly that.
2. A dead-but-wired bed is reported; the check is provably non-vacuous via the fixtures.
3. The check is advisory and honors a declared override — no legitimate game is blocked.

## Unresolved / conditions

- Build-time: fixed default floor values (pick after a baseline render).
- Rec #3 (precondition enforcement in `gameotron.md`) deliberately **deferred**.
- Soft: headless verifies the graph, not perceived loudness; noted in the check output.
