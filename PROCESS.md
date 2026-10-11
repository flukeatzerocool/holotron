# PROCESS — GAMEOTRON changes in Holotron

> **Audience: GAMEOTRON developers.** This is the "documented fork" the Gameotron Game Jam
> asks participants to publish on GitHub: every change this fork makes to GAMEOTRON in order
> to produce the jam submission game, **Torre Nosferatu**, and why. Every claim below is
> backed by an artifact under `gameotron_output/` or a command in this repo.
>
> The judge-facing process summary (use / configuration / improvement) now lives in
> `COMPLIANCE.md`, self-contained. The exhaustive, dated list of every change is
> `CHANGELOG.md`; §1's table is the rationale-and-dependency view.
>
> **Reading path:** **§7 is the submission run (Torre Nosferatu).** §2–§6 document the earlier
> **baseline run** (#7 "Rule Breaker Dungeon") that proved the integration.

## 1. Purpose, audience, and the changes at a glance

**Holotron** is a fork of GAMEOTRON (the AI game-dev orchestrator) that adds a
**Holonovel world-model MCP server** and a new **`world_agent`** at the Design phase, so
the game's world is *authored and validated* before any code is written — and the finished
game is then *behaviorally checked* against that model. Headline improvement: **"reliable
world generation" is now a measured result, not an assertion** — the generated game
traverses the exact world the model validated, with 0 game↔world mismatches, and the
checker is proven sensitive by control fixtures that catch injected errors.

### Changes vs upstream GAMEOTRON

| Artifact | Change | Rationale | Dependency |
|---|---|---|---|
| `opencode.json` (new) | Mounts the Holonovel world-model MCP server; scopes its tools to `world_agent` | Design phase can author/validate the world without exposing the model to every agent | **Holonovel** |
| `scripts/holonovel-mcp.sh` (new) | Hermetic launcher; project-local `.holonovel-state/`; pins commit `b6a182a` | Reproducible; never writes the user's Holonovel checkout; fails loudly on drift | **Holonovel** |
| `.opencode/agents/world_agent.md` (new) | Authors the spatial + social model (`manage_world(convert)`/`manage_npc`/`manage_relationship`/`manage_lore`); emits `world_template.json` + `world_map.json` | Gives `gdd_agent`/`code_agent` a validated, machine-readable world | **Holonovel** |
| `world_template.schema.json` (new) | Documented contract: archetypes, connectivity, resources, clocks, NPCs, social actions, encounter roster, `test_seed` | One hand-enforced contract across all phases | dependency-free |
| `scripts/check_template.mjs` (new) | Deterministic Phase-2 validator (`--fail-on spatial\|systemic\|any`); rooms hard, systemic advisory; fail-closed | Ties the finished game back to the validated model; no npm/puppeteer dep | dependency-free |
| `scripts/audio-check/` (new) | Control fixtures (`dead-bed.html`, `good-bed.html`) | Proves the advisory audio check is not vacuously green | dependency-free |
| `test_worlds/` (new) | Golden + malformed fixtures (spatial, archetypes, systems) | Proves checker sensitivity (the reject path fires) | dependency-free |
| `.opencode/agents/gameotron.md` (edit) | Phase 3 runs `world_agent` before `gdd_agent`; Phase 5 passes the world to `code_agent` | Additive wiring; phase order + mandatory approval gate untouched | dependency-free |
| `.opencode/agents/code_agent.md` (edit) | Embeds `window.TEMPLATE`; generates levels **and systems** seeded by `window.SEED`; exposes `worldState()`/`systemState()`/`move()`/`social()` + audio hooks; multi-floor via `down`/`up` | Makes the game's behavior checkable against the model | dependency-free |
| `.opencode/agents/gdd_agent.md` (edit) | Consumes template v2; carries the brief's acceptance checklist | Keeps the GDD bound to the authored world | dependency-free |
| `.opencode/agents/puppeteer_agent.md` (edit) | Phase 2 world↔game check (fail-closed) + advisory Phase 2b audio check | Behavioral verification, not a template echo | dependency-free |
| `.opencode/agents/audio_agent.md` (edit) | Requires a small-speaker-audible bed (no sub-150 Hz-only bed) | Closes the "silent game passed every gate" gap | dependency-free |
| `.opencode/agents/juice_agent.md` (edit) | Polish flow; `juiceEnabled` flag | Keeps juice additive + togglable | dependency-free |
| `.opencode/agents/deployment_agent.md` (edit) | Linux butler path + pinned install | Deploy from Linux | dependency-free |
| `scripts/install-butler.sh` (new) | Pinned Linux butler release install | Reproducible deploy toolchain | dependency-free |
| `AGENTS.md` (edit) | Architecture, pipeline, data-flow, gotchas reflect the integration | Single source of operating instructions | dependency-free |
| `README.md` (edit) | Fork lineage, license, opt-in deployment | Onboards a cloner | dependency-free |
| `TORRE_NOSFERATU.md` (new) | Creative-direction brief → `direction.txt` for `gdd_agent` | Constrains the submission game without pre-selecting the concept | dependency-free |

The exhaustive, dated list of every change is `CHANGELOG.md`.

## 2. How GAMEOTRON was used

- **Entry point:** `use @gameotron with theme: Anything Goes` (theme override → `theme_agent` skipped).
- **Chosen concept (mandatory approval gate):** #7 "Rule Breaker Dungeon" — a human
  override of the raw weighted leader #20 (chosen because it has a spatial rooms/exits
  world the Holonovel model can validate). See `selected_concept.txt`.
- **Phases exercised and outputs** (all in `gameotron_output/20261009_151802/`):
  | Phase | Agent(s) | Output |
  |---|---|---|
  | 2 Ideation/Eval | `evaluation_agent` | `selected_concept.txt` (scoring + #7) |
  | 3 Design | **`world_agent`** → `gdd_agent` | `world_map.json`, `world_map.txt`, `gdd.md` |
  | 4 Concept art | `audio_agent` + `visual_agent` (parallel) | `audio_direction.txt`, `visual_direction.txt` |
  | 5 Implementation | `code_agent` | `index.html` (1388 lines) |
  | 5 Review loop | `review_agent` + `puppeteer_agent` → `bugfix_agent` ×3 cycles | `buglist_R1..R3.txt`, `runtime_R1..R4.txt`, `test_report_R*.txt` |
  | 2 (Holotron) | `puppeteer_agent` | `phase2_report.txt` (world↔game consistency) |
  | 5.5 Polish | `juice_agent` | `juice_report.txt` → `index.html` (1581 lines) |
- **Final build:** `index.html` = 1581 lines, single file, vanilla JS + WebAudio, no external assets.
  Verified on 1920×1080, 800×600, 375×667: **33/33 checks each, 0 console errors** (`final_report.txt`).
- **Deployment:** `build/` → itch.io `flukeatzerocool/holotron:html5`, build **#2095371 v0.1.0**
  (`butler status`), live at <https://flukeatzerocool.itch.io/holotron>.

## 3. How GAMEOTRON was configured

- **`opencode.json` (new, project scope)** — mounts the Holonovel world-model as a local
  MCP server via `scripts/holonovel-mcp.sh`, and scopes it:
  `permission: { "*":"allow", "holonovel_*":"deny", "read_mcp_resource":"deny" }` with
  `agent.world_agent.permission` re-allowing Holonovel tools + `read_mcp_resource`.
- **`scripts/holonovel-mcp.sh`** — hermetic launcher: sets `TTRPG_DATA_DIR` to a
  project-local `.holonovel-state/` (so the shared fork is reproducible and the user's
  Holonovel checkout is never written), prefers the built `dist/index.js` via `node`.
  Hermeticity matters because opencode **deep-merges** the global `mcp.holonovel` block,
  whose `TTRPG_DATA_DIR` points at a different install; the wrapper ignores inherited
  `TTRPG_*` values. It also **pins the Holonovel commit** (`b6a182a`) and exits loudly on
  drift (override with `HOLOTRON_HOLONOVEL_PIN`), so a judge can reproduce the model.
- **`theme_override`** — `theme: Anything Goes` bypasses the network theme fetch.
- **Hard constraint honored:** nothing is written under `/home/fluke/Holonovel*`; the
  world state lives in `Holotron/.holonovel-state/`.

## 4. How GAMEOTRON was improved

### 4.1 `world_agent` (new, Design phase)
- **What it does:** authors the world as Holonovel assertions → `manage_world(convert)`
  validates it → reads back `world://map` → emits a canonical, machine-readable
  `world_map.json` (slug-keyed rooms/exits/things) **and** a human `world_map.txt`, handed
  to `gdd_agent` and `code_agent`.
- **Additive orchestrator edit:** `gameotron.md` Phase 3 now runs `world_agent` before
  `gdd_agent`; Phase 5 passes the world to `code_agent`. Phase order and the mandatory
  approval gate are untouched. `AGENTS.md` (architecture, pipeline table, data-flow table,
  gotchas) documents it.
- **Spike-driven correctness fix:** the *deployed* Holonovel build rejects the markdown
  `## Room:` form and sentence-form exits that the source repo documents — `world_agent.md`
  was corrected to sentence-form rooms + `create_exit` after the spike caught this
  (evidence: `world_map.txt`, run log).
- **Result:** `[OK] World model populated: 6 rooms` → 12 directed exits, 4 things, a 4-room
  loop; `world://map` confirmed.

### 4.2 Linux deployment
- `deployment_agent.md` gained a **Linux section** (Windows path kept): pinned install via
  `scripts/install-butler.sh` (GitHub release asset — the canonical `broth.itch.ovh`
  host did not resolve here), auth via `~/.config/itch/butler_creds`, and the
  `butler push build/ <user>/<project>:html5` command.
- **Correction captured:** butler does not read `$BUTLER_API_KEY` natively (it reads the
  creds file) — the Windows env-var convention is a wrapper convention.
- **Smoke test → live:** placeholder push first proved the path, then the real build went
  live. Recorded gotchas: itch.io requires a **verified account email** before the first
  upload (400 otherwise) and the project must be set **Public** for the page to resolve.

### 4.3 Reliability check (Phase 2)
- A dedicated post-generation check ties the game back to the model. The game embeds the
  validated world as `window.WORLD` (single source of truth) and exposes
  `window.move(dir)` that calls the **same** transition handler the UI uses. (The contract
  later moved to `window.TEMPLATE` — see AGENTS.md; the baseline run predates that.)
- `puppeteer_agent` **drives the game** (real moves) and compares the *observed* room graph
  to `world_map.json` — not a copy of the embedded JSON.
- **Control fixture** `test_worlds/malformed.json` (a dangling exit + an unreachable room)
  is run through the same checker and **must** report ≥2 mismatches, proving the check
  detects errors rather than parroting the file.

### 4.4 Systemic deepening (2026-10-10)

- Extended the world template from **spatial-only** to the **full game loop**: `resources`,
  `clocks` (the candle + the tug-of-war Dread dial with `tiers`/`effects`), `npcs`,
  `social_actions` (warm/cold), `encounter_roster`, `required_encounters`, and a pinned
  `test_seed`. The contract now lives in `world_template.schema.json` (documented, hand-enforced).
- `world_agent` now authors the **social model** (`manage_npc`/`manage_relationship`/`manage_lore`)
  and emits the v2 template; `code_agent` reads every system from `window.TEMPLATE` and exposes
  `window.systemState()` + `window.social(id)` as **same-handler** hooks, so the Phase 2 check is
  **behavioral** — a copy-the-template echo cannot pass it.
- **Spike correction (build `b6a182a`):** the deployed `manage_countdown` has **no `clock_type`**
  and cannot count up, so the Dread dial is authored as **lore** (`key: dread-dial`), not a
  `tug_of_war` clock. `clocks[].behavior` is our own contract field, not a Holonovel feature.
- The Holonovel dependency is **pinned to commit `b6a182a`**; the launcher fails loudly on drift.

### 4.5 Phase 2 checker wiring (2026-10-10)

- `puppeteer_agent` Phase 2 now runs the validator end-to-end. Because the repo forbids
  npm/puppeteer dependencies, the **browser work is agent-driven** (Puppeteer, or the
  `playwright-cli` fallback + `python3 -m http.server`): it pins `window.SEED =
  TEMPLATE.test_seed`, snapshots `worldState()`/`systemState()` into `state_<seed>.json`, and
  **synthesizes `socialLog`** by driving ≥1 warm + ≥1 cold `window.social(id)` (the documented
  `systemState()` does not expose one).
- The dependency-free `scripts/check_template.mjs` gained `--fail-on spatial|systemic|any`
  (default `any`) so the harness expresses the policy — **rooms hard, systemic advisory** —
  machine-readably instead of parsing output text. Guard mismatches always fail.
- Fail-closed: a missing hook, an unpopulated `socialLog`, or a null `test_seed` reports
  **unverified** — never a vacuous pass. The stale "archetype role/`count`" claim was dropped
  from the Phase 2 prose   (the script does not check it); **C6 (2026-10-10) restored the claim truthfully** —
  `check_template.mjs` now enforces each room's archetype id + per-archetype `count` bounds
  (hard `spatial`), proven by the `malformed_archetypes.json` reject fixture. Connectivity
  remains unvalidated (filed as C7).

Open follow-ups (the Torre run, the **C5** end-to-end checker run, and the deferred Holonovel
systems) are tracked in `ROADMAP.md`.

### 4.6 Verification scope — audio (2026-10-10)

A subsystem is **unverified unless a rubric names it**. The Torre Nosferatu run passed every
gate — static review, runtime tests, the world-model checker, B7 — and still shipped a
**dead/inaudible audio layer**: `review_agent` and `puppeteer_agent` had no audio check, so
silence passed as success. The `audio_direction.txt` had even specified the bed at the
"edge of hearing" with a 38 Hz-only drone, below small-speaker reproduction — a faithful
implementation of an inaudible spec. The gap is now closed: `code_agent` must expose
`window.audioTest()` + `window.AUDIO_SPEC`, and `puppeteer_agent` runs an **advisory** audio
check (Phase 2b) against `scripts/audio-check/` control fixtures (dead bed must miss its
floor, good bed must pass). Advisory means it can never false-fail a valid game; a miss is
reported, not blocking. Lesson: a green pipeline is only green for what its rubrics assert.

### 4.7 Deployment is opt-in; a playtest stop ends the default run (2026-10-10)

- Codified the jam-requirement interpretation in the pipeline: the **default run ends at
  Phase 5.5** (polish) and hands the playable `index.html` back for **playtesting before any
  deployment**; `deployment_agent` runs only on an **explicit request** and stops before any
  `butler push` (which needs an explicit confirmation). Theme handling and the mandatory
  approval gate are unchanged; the 20 reviewed concepts are a pool to **choose from or adapt**.
- Mirrored in `gameotron.md` (Phase 1/2/6), `AGENTS.md` (pipeline table + gotchas),
  `README.md` (Phase 6), and `juice_agent.md` (flow). This is a *configuration* of
  GAMEOTRON, recorded here per the "configured or improved" requirement.

## 5. Before/after metric

Single-run proxy (per the approved plan) plus a sensitivity control. "Baseline" = the
pipeline without the integration (no world validation, no world↔game check existed).

| Metric | Baseline (no integration) | With integration |
|---|---|---|
| World structures validated before `code_agent` | none (no validator) | **6 rooms / 12 exits / 4 things**, 0 dangling exits (`convert` + `world://map`) |
| Design-time `convert` warnings | n/a | 0 (after the DSL adapter fix) |
| Game↔world mismatches after generation | unmeasured (no check) | **0** (Phase 2 behavioral: 24 real transitions, 6/6 rooms) |
| Control: checker sensitivity (injected errors caught) | n/a | **2** (`test_worlds/malformed.json`) |
| Runtime console errors (3 viewports) | — | 0 |

Method: Phase 2 structural + behavioral traversal with the counter; control run against
the malformed fixture. Evidence: `phase2_report.txt`, `world_map.json`, `world_map.txt`.

## 6. Reproduction

From a clean checkout:
1. Install butler: `scripts/install-butler.sh` (pinned Linux binary → `.tools/`, gitignored).
2. Ensure a Holonovel checkout is available; set `HOLONOVEL_DIR` if not at the default.
   Restart opencode so `opencode.json` (the `holonovel` MCP + `world_agent`) loads.
3. Run `use gameotron with theme: Anything Goes`; at the approval gate select **#7**.
4. Pipeline produces `gameotron_output/<ts>/` incl. `world_map.json`, `gdd.md`, `index.html`.
5. Phase 2: `puppeteer_agent` runs the world↔game check + `test_worlds/malformed.json` control.
6. (Separate, explicitly-requested step) Deploy after playtesting: `butler login`;
   `butler push build/ <user>/<project>:html5 --userversion <ver>`. The default run ends at
   Phase 5.5 — deployment is opt-in and the push needs an explicit confirmation.

## 7. Torre Nosferatu run (submission game) — 2026-10-10

> Evidence: `gameotron_output/20261010_095651/` (all artifacts) and its run log
> `20261010_095651.log`.

### 7.1 How it was used
- **Entry point:** `use gameotron with theme: Torre Nosferatu — escape a pitch-black candle-lit
  tower before Count Orlok takes your light`, plus **full controls** (WASD/arrows/Space).
- **Creative-direction brief:** `TORRE_NOSFERATU.md` was written to `direction.txt` and passed to
  `gdd_agent` as a **constraint source** (not a spec). The mandatory **approval gate fired**; the
  user selected concept **#14 "Dread Weather"** from the reviewed 20 (the brief constrained the
  space but did not pre-select — recorded in the run log).
- **Phases/outputs** (all in the run folder):
  | Phase | Agent(s) | Output |
  |---|---|---|
  | 2 Ideation/Eval | `ideation_agent` → `browsergame_expert` → gate → `evaluation_agent` | `concepts.txt` (20), `concepts_with_review.txt`, `selected_concept.txt` |
  | 3 Design | **`world_agent`** → `gdd_agent` | `world_template.json`/`.txt`, `world_map.json`/`.txt`, `gdd.md` |
  | 4 Concept art | `audio_agent` + `visual_agent` (parallel) | `audio_direction.txt`, `visual_direction.txt` |
  | 5 Implementation | `code_agent` | `index.html` |
  | 5 Review loop | `review_agent` + `puppeteer_agent` → `bugfix_agent` ×3 | `buglist_*.txt`, `runtime_errors_*.txt`, `test_report_*.txt` |
  | 2 (Holotron) | `puppeteer_agent` | `phase2_report_*.txt`, `state_20261010.json` |
  | 5.5 Polish | `juice_agent` | `juice_report.txt` → `index.html` (2109 lines) |
- **Final build:** `index.html` = 2109 lines, single file, vanilla JS + procedural WebAudio, no
  external assets. Verified at 1920×1080, 800×600, 375×667: **51/51 checks, 0 console errors**.

### 7.2 Holotron-specific results (world-model ↔ game)
- `world_agent` authored + `manage_world(convert)`-validated the tower: **11 rooms, 17 directed
  exits**, 5 NPCs (Vlask/Sister Marta/Ilona/Petr/Nadja), 6 creatures (Orlok excluded from the
  roster), Dread authored as **lore `key: dread-dial`** (the pinned `manage_countdown` cannot count
  up), template `clocks[]` = `wax` decrement + `dread` `tug_of_war` 0–8 with 5 tiers.
- **P1.2 Design-phase acceptance check** (added this run): non-null `test_seed=20261010`, 3/3
  `required_encounters` reachable and in roster, ≥1 NPC, Dread clock with tiers — checked *before*
  `code_agent`, so a fail-closed "unverified" cannot surprise the Phase 2 gate.
- **B7 gate: PASS** — `window.systemState()` tower-wide at the **pristine boot state** returns a
  non-null `dread` clock + all 5 NPCs; `window.social(id)` drives the UI handler; a
  `required_encounters` entry (`bats`) is reachable on `test_seed`; all 5 wave-3 flags toggle
  **without gating the frozen hooks** (`social`, required encounters, NPC/Dread state).
- **C5 end-to-end: PASS** — `node scripts/check_template.mjs --fail-on spatial` on the real Torre
  artifacts → **spatial 0, systemic 0, exit 0**. Control fixtures fire as designed (golden 0/exit0;
  malformed 4 spatial/exit1; malformed_archetypes 3 spatial/exit1; malformed_systems 7 systemic/exit0).
- **Review loop:** cycle 1 found 6 HIGH + 9 MEDIUM (Q-key descent sequence-break; unreachable
  borrowed-door ending; creature effects double-charged; Dread starting-disposition dead code;
  encounters not advancing the turn); cycle 2 found **1 HIGH remaining** — the borrowed-door *win*
  was shadowed because the exit-key is auto-collected on the stair you must stand on to descend;
  cycle 3 **clean** (0 CRITICAL/HIGH/MEDIUM). The fix makes the door a real two-button choice
  (use your key → full 1000; slip out → borrowed 400), verified in a natural playthrough.

### 7.3 Before/after metric (this run)
| Metric | Baseline (no integration) | This run (with integration) |
|---|---|---|
| World structures validated before `code_agent` | none | **11 rooms / 17 directed exits**, 0 dangling (`convert` + `world://map`) |
| Design-time fail-closed risk caught before code | none | **0** (P1.2 check passed pre-code) |
| Game↔world mismatches (Phase 2, `test_seed`) | unmeasured | **0 spatial, 0 systemic** (exit 0) |
| B7 (social + Dread shipped, hooks frozen) | unmeasured | **PASS** |
| Runtime console errors (3 viewports) | — | **0** (51/51 checks) |

### 7.4 Deployment
- **Two itch.io pages:** the **game** (Torre Nosferatu — new project) and the **process/pipeline**
  page (`holotron`, the baseline). The judged "documented process" half is now self-contained in
  `COMPLIANCE.md` (this file is the dev-facing depth).
- Deploy via `deployment_agent` / butler to the Torre project, **after user confirmation**, then
  set Public and confirm the page resolves + the jam entry is in (before 2026-10-11 12:00).

### 7.4a Post-playtest revision (2026-10-11)
After the default run handed back `index.html` for playtest, five user complaints were addressed
from a static audit plus a new **zero-dependency autoplay harness** (`scripts/autoplay/`; committed
source, agent-invoked, drives the real game through `worldState`/`systemState`/`testState`/`move`).
- **One key per floor.** The auto-collected `exit-key` (which re-granted "THE KEY" on every stair,
  §7.2 cycle 2) and the ambiguous `locked-door` "force it" puzzle are replaced: each floor places a
  single `floor-key` (Spire: treasure room; floors 2-6: puzzle room) that unlocks that floor's
  `down` gate; it is consumed by descending. Template `required_things` now includes `floor-key`.
- **Run/Endure.** Run costs wax; Endure snuffs the candle for **no wax** and costs a **match** to
  re-light (re-light adds no wax); a snuff with no match enters the guttering-dark grace.
- **Wax (data-driven).** A greedy bot died 26 % of 50 seeds; the binding constraint was the 30-wax
  **cap wasting refills**. Raising the pool to **32 start / 40 max / refill +14** lifted greedy
  completion to **94 %** (median surplus 43.8 %, 0 ghost keys) — the success bar the grill set.
- **Visibility.** The radius curve was flattened (`window.TUNING`, floor 2); arm B still spends
  ~43 % of lit turns at radius 1, confirming the near-blind condition the fix removes. The bot
  navigates by graph, so it cannot itself prove a comprehension gain — that remains a human check.
- **Gate:** `check_template.mjs --fail-on spatial` → **spatial 0, systemic 0, exit 0** on the
  revised template/state. Reports: `playtest_ab.json` / `playtest_ab_summary.txt`; stress-test:
  `docs/grill-me/2026-10-11-torre-nosferatu-autoplay-and-fixes-stress-test.md`.

### 7.5 Reproduction (Torre Nosferatu)

From a clean checkout, this path produces the **submission game** (see §6 for the baseline run):

1. Ensure `opencode.json` + a Holonovel checkout load (restart opencode), then use the theme
   override. Write the brief `TORRE_NOSFERATU.md` to the run folder as `direction.txt` — a
   **constraint source**, not a spec.
2. Run `use gameotron with theme: Torre Nosferatu — escape a pitch-black candle-lit tower before
   Count Orlok takes your light`, plus **full controls** (WASD/arrows/Space). At the mandatory
   approval gate, select a Torre-shaped concept (this run: **#14 "Dread Weather"**).
3. Pipeline: `ideation_agent` → `browsergame_expert` → **gate** → `evaluation_agent` →
   `world_agent` → `gdd_agent` → (`audio_agent` ∥ `visual_agent`) → `code_agent` →
   [`review_agent` + `puppeteer_agent` → `bugfix_agent`] ×≤3 → `juice_agent`. Outputs land in
   `gameotron_output/20261010_095651/`.
4. `world_agent` emits `world_template.json`/`.txt` + `world_map.json`/`.txt`: **11 rooms, 17
   directed exits, 5 NPCs, 6 creatures**, Dread authored as lore `key: dread-dial`,
   `test_seed=20261010`. Multi-floor: each floor is generated once from `hash(seed, depth)`,
   cached and mutated in place, and traversed via declared `down`/`up` exits; `worldState()`
   reports the active floor.
5. Verify: Phase 2 checker (`node scripts/check_template.mjs --fail-on spatial` → spatial 0,
   systemic 0, exit 0); B7 gate (`systemState()` returns a non-null Dread clock + all 5 NPCs at
   the pristine boot state; `social(id)` drives the UI handler; a `required_encounters` entry is
   reachable on `test_seed`).
6. Follow the run via the artifacts listed in §7.1. Deployment is opt-in (§7.4).
